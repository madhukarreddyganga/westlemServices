import React, { useEffect, useState } from "react";
import "./styles.css";
import Slider from "react-slick";
import Modal from "react-modal";
import westlemServices from "./westlemServices";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

Modal.setAppElement("#root");

function App() {
  const [data, setData] = useState({}),
    [openModal, setModalOpen] = useState(false),
    [currentHeroImages, setCurrentHeroImages] = useState([]);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  const showOverLay = (images) => {
    setModalOpen(true);
    setCurrentHeroImages(images);
  };

  useEffect(() => {
    westlemServices
      .get("/services/catalog/v4/category/shop/new/all-new/index.json")
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      {/*below 640px we can see text and price below the image*/}
      {Array.isArray(data.groups) && (
        <Slider {...settings}>
          {data.groups.map((group, index) => {
            return (
              <div className="groupImages" key={index}>
                <img
                  src={group.hero.href}
                  key={index.id}
                  alt={group.hero.alt}
                  onClick={() => showOverLay(group.images)}
                />
                <span className="names">
                  {group.name}
                  <br />
                </span>
                <span className="price" key={index}>
                  ${group.priceRange?.selling?.high}
                  <br />
                </span>
              </div>
            );
          })}
        </Slider>
      )}
      {openModal && (
        <Modal
          style={{
            overlay: {
              backgroundColor: "grey"
            }
          }}
          onRequestClose={() => setModalOpen(false)}
          shouldCloseOnOverlayClick={false}
          isOpen={openModal}
        >
          <button className="close" onClick={() => setModalOpen(false)}>
            X
          </button>
          <Slider>
            {currentHeroImages.map((image, index) => {
              return (
                <img
                  src={image.href}
                  key={index}
                  alt={image.alt}
                  height={500}
                  width={500}
                />
              );
            })}
          </Slider>
        </Modal>
      )}
    </div>
  );
}

export default App;
