
export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <>
        <div className="flex-grow w-full flex flex-col">
          <div className="w-full h-16" />
          <div className="flex flex-col justify-center items-center flex-grow py-4">
            {children}
          </div>
        </div>
      </>
    )
}