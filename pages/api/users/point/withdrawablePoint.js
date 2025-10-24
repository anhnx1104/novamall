import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

export default async function updateWithdrawablePoint(req, res) {
  const { method } = req;

  if (!(await sessionChecker(req, "customers")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        const { id, withdrawablePoint } = req.body;

        if (!id || withdrawablePoint === undefined) {
          return res.status(400).json({ success: false, message: "User ID and withdrawablePoint are required" });
        }

        // 현재 유저 데이터를 가져옵니다.
        const user = await userModel.findById(id);

        if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
        }

        // 수정된 출금 가능 포인트를 반영하고 총 적립된 출금 가능 포인트를 업데이트합니다.
        const updatedUser = await userModel.findByIdAndUpdate(
          id,
          {
            $set: {
              withdrawablePoint,
              totalWithdrawablePoint: user.totalWithdrawablePoint + (withdrawablePoint - user.withdrawablePoint),
            },
          },
          { new: true }
        );

        res.status(200).json({
          success: true,
          data: updatedUser,
        });
      } catch (err) {
        res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Invalid request method" });
      break;
  }
}