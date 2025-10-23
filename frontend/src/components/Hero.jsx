export default function Hero({ onGetStarted }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Create Amazing Content
            <span className="text-primary-600"> Effortlessly</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Content Studio simplifies content creation by making it reliable, structured, 
            user-friendly, and multi-format. Perfect for educators and content creators.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button 
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Creating
            </button>
            <button className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


