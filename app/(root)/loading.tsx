import Spinner from "@/components/custom/spinner";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-white">
      <Spinner />
    </div>
  );
};

export default Loading;