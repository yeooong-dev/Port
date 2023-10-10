import React from "react";

interface CustomAlertProps {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  type = "error",
  onClose,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        backgroundColor: type === "error" ? "#d43a2f" : "#91a4d9",
        padding: "30px 50px",
        borderRadius: "5px",
        color: "#fff",
        fontSize: "1.1rem",
        zIndex: 1000,
      }}
    >
      <span>{message}</span>
      <button
        style={{
          marginLeft: "20px",
          background: "none",
          border: "2px solid white",
          cursor: "pointer",
          fontSize: "1.2rem",
          width: "30px",
          height: "30px",
          color: "white",
          borderRadius: "50%",
        }}
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
};

export default CustomAlert;
