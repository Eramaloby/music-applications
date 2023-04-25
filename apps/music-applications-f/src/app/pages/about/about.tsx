/* eslint-disable jsx-a11y/accessible-emoji */
import './about.styles.scss';


const AboutPage = () => {
  return (
    <div className="about-page-wrapper">
      <div className="about-page-header-text">Над проектом работали:</div>
      <div className="about-page-members-list-wrapper">
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#129332; 1.Шайковский Е.Н.
          </div>
          <div className="about-page-team-member-img">
            <img
              src="../../../assets/Boss.jpg"
              height={300}
              width={300}
              alt="Шашковский"
            ></img>
          </div>
        </div>
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#129321; 2.Дятел К.Д.
          </div>
          <div className="about-page-team-member-img">
            <img
              src='../../../assets/maloy.jpg'
              height={300}
              width={300}
              alt="Малой"
            ></img>
          </div>
        </div>
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#128526; 3.Карачун И.В.
          </div>
          <div className="about-page-team-member-img">
            <img
              src='../../../assets/Ivan.jpg'
              height={300}
              width={300}
              alt="Вантус"
            ></img>
          </div>
        </div>
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#129313; 4.Дятел В.В.
          </div>
          <div className="about-page-team-member-img">
            <img
              src='../../../assets/Dura_gde_siski.jpg'
              height={300}
              width={300}
              alt="Уже нет на проекте"
            ></img>
          </div>
        </div>
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#129314; 5.Рассафонов С.Д.
          </div>
          <div className="about-page-team-member-img">
            <img
              src='../../../assets/S1rGay.jpg'
              height={300}
              width={300}
              alt="Уже нет на проекте"
            ></img>
          </div>
        </div>
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#129312; 6.Лаптев К.Д.
          </div>
          <div className="about-page-team-member-img">
            <img
              src='../../../assets/Podik.jpg'
              height={300}
              width={300}
              alt=""
            ></img>
          </div>
        </div>
        <div className="about-page-team-member">
          <div className="about-page-team-member-text">
            &#128128; 7.Селедцов Е.Д.
          </div>
          <div className="about-page-team-member-img">
            <img
              src='../../../assets/dildo.jpg'
              height={300}
              width={300}
              alt="Дылда"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
