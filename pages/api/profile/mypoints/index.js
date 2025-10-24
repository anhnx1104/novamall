import { getToken } from "next-auth/jwt";
import userModel from "../../../../models/user";
import pointHistoryModel from "../../../../models/pointHistory";
import mongoose from "mongoose";
import dbConnect from "../../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
  if (!session)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const user = await userModel
          .findById(session.user.id)
          .select(
            "withdrawablePoint shoppingPoint totalWithdrawablePoint totalShoppingPoint"
          );
        res.status(200).json({ success: true, data: user });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      const sessionDb = await mongoose.startSession();
      sessionDb.startTransaction();
      try {
        const { email, point } = req.body;

        const sendUser = await userModel
          .findById(session.user.id)
          .session(sessionDb);

        if (sendUser.withdrawablePoint < point) {
          await sessionDb.abortTransaction();
          sessionDb.endSession();
          return res
            .status(400)
            .json({ success: false, message: "Insufficient points" });
        }

        const recieveUser = await userModel
          .findOne({ email: email })
          .session(sessionDb);

        if (!recieveUser) {
          await sessionDb.abortTransaction();
          sessionDb.endSession();
          return res
            .status(400)
            .json({ success: false, message: "User not found" });
        }

        // 포인트 전송
        sendUser.withdrawablePoint -= point;
        recieveUser.withdrawablePoint += point;
        recieveUser.totalWithdrawablePoint += point;

        await sendUser.save({ session: sessionDb });
        await recieveUser.save({ session: sessionDb });

        // 송신자 이력 기록
        await pointHistoryModel.create(
          [
            {
              user: sendUser._id,
              pointType: "withdrawable",
              pointUsage: "send",
              point: -point,
              status: "completion",
            },
          ],
          { session: sessionDb }
        );

        // 수신자 이력 기록
        await pointHistoryModel.create(
          [
            {
              user: recieveUser._id,
              pointType: "withdrawable",
              pointUsage: "earned",
              point: point,
              status: "completion",
            },
          ],
          { session: sessionDb }
        );

        await sessionDb.commitTransaction();
        sessionDb.endSession();
        res
          .status(200)
          .json({ success: true, message: "Point sent successfully" });
      } catch (err) {
        await sessionDb.abortTransaction();
        sessionDb.endSession();
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
