import { useNavigation } from "react-router-dom";

interface SubmitBtnProps {
  text?: string;
}

const SubmitBtn = ({ text }: SubmitBtnProps) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      type="submit"
      className="btn btn-primary btn-square btn-block mt-4 text-[1rem]"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <span className="loading loading-spinner" />
      ) : (
        <span>{text || "Submit"}</span>
      )}
    </button>
  );
};

export default SubmitBtn;
