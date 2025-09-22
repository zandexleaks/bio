 "use client"

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="animate-bounce">
        <img
          src="https://pub-33162c3404764e628cecfdac6f2b0d9f.r2.dev/43BC905D-5178-46B7-9A41-04DF55AAE314.GIF"
          alt="Loading..."
          className="w-24 h-24 rounded-full"
        />
      </div>
      <p className="mt-6 text-3xl font-bold tracking-wider bg-gradient-to-r from-white via-purple-500 to-white bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-anim">
        /comincel library
      </p>
    </div>
  )
}