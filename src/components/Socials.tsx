import { FiArrowUpRight } from "react-icons/fi";

type Social = {
  name: string;
  url: string;
};

const socials: Social[] = [
  { name: "github", url: "https://github.com/yusup-dev" },
  { name: "linkedin", url: "https://www.linkedin.com/in/yusup-dev" },
  { name: "instagram", url: "https://instagram.com/muhamadyusup3_" },
  { name: "email", url: "mailto:muh.yusup965@gmail.com" },
];

const Socials = () => {
  return (
    <div className="socials">
      {socials.map(({ name, url }) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
        >
          <FiArrowUpRight className="icon" />
          <span>{name}</span>
        </a>
      ))}
    </div>
  );
};

export default Socials;
