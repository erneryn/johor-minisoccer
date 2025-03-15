const MainButton = ({ text, link }: { text: string, link: string }) => {
    return (
        <a href={link} className="inline-block bg-orange-500 text-white hover:bg-blue-900 hover:outline hover:outline-white px-8 py-3 rounded-lg font-semibold transition-colors relative z-10"
        >
            {text}
        </a>
    )
}

export default MainButton;