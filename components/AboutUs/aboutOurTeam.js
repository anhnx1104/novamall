import Link from "next/dist/client/link";
import { A11y, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import ImageLoader from "../Image";
import classes from "./about.module.css";
const breakpointNewArrival = {
  360: {
    slidesPerView: 1,
  },
  480: {
    slidesPerView: 2,
  },
  600: {
    slidesPerView: 2,
  },
  991: {
    slidesPerView: 3,
  },
  1200: {
    slidesPerView: 4,
  },
};
function AboutOurTeam(props) {
  return (
    <div className="content_container">
      <div className="custom_container">
        <p className={classes.our_team_heading}>우리 팀을 만나보세요</p>
        <div className={classes.our_team_content}>
          <Swiper
            key={"slider_testimonial"}
            id="slider_testimonial"
            modules={[A11y, Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView="auto"
            breakpoints={breakpointNewArrival}
            // className={`_testimonial_slider ${c.root_container}`}
            autoplay={{
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            loop={false}
            centeredSlides={false}
            centerInsufficientSlides={true}
            speed={900}
            navigation={{
              nextEl: ".button_next4",
              prevEl: ".button_prev4",
            }}
          >
            {[
              {
                name: "Jane Doe",
                icon: process.env.NEXT_PUBLIC_URL + "/images/our_team1.png",
                description: "Founder & CEO",
              },
              {
                name: "John Smith",
                icon: process.env.NEXT_PUBLIC_URL + "/images/our_team2.png",
                description: "Chief Operating Officer (COO)",
              },
              {
                name: "Emily Johnson",
                icon: process.env.NEXT_PUBLIC_URL + "/images/our_team3.png",
                description: "Chief Technology Officer (CTO)",
              },
              {
                name: "Michael Brown",
                icon: process.env.NEXT_PUBLIC_URL + "/images/our_team4.png",
                description: "Chief Marketing Officer (CMO)",
              },
            ].map((item, index) => (
              <SwiperSlide
                key={index}
                className={classes.silde_our_team_container}
              >
                <div className={classes.our_team_category_root}>
                  <div className={classes.our_team_container}>
                    <div>
                      <ImageLoader
                        src={item?.icon}
                        alt={item?.title}
                        width={180}
                        height={180}
                        style={{
                          width: "180px",
                          height: "180px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <h3 className={classes.our_team_name}>{item?.name}</h3>
                    <p className={classes.our_team_description}>
                      {item?.description}
                    </p>
                    <div className={classes.our_team_social_media}>
                      <Link href={`#`}>
                        <ImageLoader
                          src={
                            process.env.NEXT_PUBLIC_URL +
                            "/images/icon_social1.png"
                          }
                          alt="LinkedIn"
                          width={40}
                          height={40}
                        />
                      </Link>
                      <Link href={`#`}>
                        <ImageLoader
                          src={
                            process.env.NEXT_PUBLIC_URL +
                            "/images/icon_social2.png"
                          }
                          alt="Google"
                          width={40}
                          height={40}
                        />
                      </Link>
                      <Link href={`#`}>
                        <ImageLoader
                          src={
                            process.env.NEXT_PUBLIC_URL +
                            "/images/icon_social3.png"
                          }
                          alt="Facebook"
                          width={40}
                          height={40}
                        />
                      </Link>
                      <Link href={`#`}>
                        <ImageLoader
                          src={
                            process.env.NEXT_PUBLIC_URL +
                            "/images/icon_social4.png"
                          }
                          alt="Twitter"
                          width={40}
                          height={40}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="content_spacing" />
    </div>
  );
}

export default AboutOurTeam;
