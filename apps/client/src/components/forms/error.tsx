const Error = ({ text }: { text?: string }) => {
  if(!text) return null;
  return <div className="text-red-400 text-[1rem]">{text}</div>
}

export default Error;