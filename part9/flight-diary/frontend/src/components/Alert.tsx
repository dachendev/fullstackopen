interface AlertProps {
  color: "error";
  text: string | null;
}

const Alert = ({ color, text }: AlertProps) => {
  if (!text) {
    return null;
  }

  if (color === "error") {
    return <p style={{ color: "red" }}>{text}</p>;
  }

  const _exhaustiveCheck: never = color;
  return _exhaustiveCheck;
};

export default Alert;
