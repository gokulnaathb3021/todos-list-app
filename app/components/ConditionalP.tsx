type propType = {
  text: string;
};

const ConditionalP: React.FC<propType> = ({ text }) => {
  return (
    <p
      style={{
        textAlign: "center",
        margin: "0",
        padding: "0",
        fontSize: "large",
      }}
    >
      {text}
    </p>
  );
};

export default ConditionalP;
