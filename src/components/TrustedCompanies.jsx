import alliedCarelogo from "../assets/logos/allied-care.png";
import anchorTrust from "../assets/logos/anchor-trust.png";
import averyLogo from "../assets/logos/avery-logo.png";
import barchesterLogo from "../assets/logos/barchester-logo.png";
import communityLogo from "../assets/logos/community-intergrated-care.png";
import dimensionsLogo from "../assets/logos/dimensions-logo.png";
import helpingHands from "../assets/logos/helping-hands-logo.png";
import leonardCheshire from "../assets/logos/leonard-cheshire.png";
import nationalLogo from "../assets/logos/national-group-logo.png";
import prioryLogo from "../assets/logos/priory-logo.png";
import turningPoint from "../assets/logos/turning-point-logo.png";
import lifewaysLogo from "../assets/logos/lifeways-logo.png";
import mariaMallaband from "../assets/logos/maria-mallaband-logo.png";
import mencapLogo from "../assets/logos/mencap.png";
import prestigeLogo from "../assets/logos/prestige-logo.png";
import sunriseLogo from "../assets/logos/sunrise-logo.png";
import voyageLogo from "../assets/logos/voyager-logo.png";

export default function TrustedCompanies() {
  const companies = [
    { name: "Allied Care", logo:alliedCarelogo },
    { name: "Anchor Trust", logo: anchorTrust },
    { name: "Avery", logo: averyLogo },
    { name: "Barchester", logo: barchesterLogo },
    { name: "Community Integrated Care", logo: communityLogo },
    { name: "Dimensions", logo: dimensionsLogo },
    { name: "Helping Hands", logo: helpingHands },
    { name: "Leonard Cheshire", logo: leonardCheshire },
    { name: "National Group", logo: nationalLogo },
    { name: "Priory Group", logo: prioryLogo },
    { name: "Turning Point", logo: turningPoint },
    { name: "Lifeways", logo: lifewaysLogo },
    { name: "Maria Mallaband", logo: mariaMallaband },
    { name: "Mencap", logo: mencapLogo },
    { name: "Prestige", logo: prestigeLogo },
    { name: "Sunrise", logo: sunriseLogo },
    { name: "Voyage", logo: voyageLogo },
  ];

  const items = [...companies, ...companies];

  return (
    <section className="trusted-section">
      <p className="trusted-label">
        Trusted by leading UK care &amp; healthcare employers
      </p>
      <div className="logos-track-wrapper">
        <div className="logos-track">
          {items.map((co, i) => (
            <div className="logo-tile" key={i} aria-label={co.name}>
              <img src={co.logo} alt={co.name} className="logo-img" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
