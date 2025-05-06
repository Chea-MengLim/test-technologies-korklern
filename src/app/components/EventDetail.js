import FacebookShareButton from "./FacebookShareButton";

const EventDetail = () => {
  const url = "https://your-vercel-domain.vercel.app"; // Replace with your actual domain
  const quote = "Check out this awesome event on KorkLern! 🎉";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">Live Concert 2025</h1>
      <img
        src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=800&q=80"
        alt="Event Banner"
        className="rounded shadow mb-4"
      />
      <p className="text-center mb-6 text-gray-700">
        Join us for an unforgettable night of music and energy!
      </p>
      <div className="flex justify-center">
        <FacebookShareButton url={url} quote={quote} />
      </div>
    </div>
  );
};

export default EventDetail;
