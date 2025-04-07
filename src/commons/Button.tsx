interface CustomButtonProps{
name: string
}


const CustomButton:React.FC<CustomButtonProps> = ({name}) => {
    return (
        <div className="w-full">
            <button className="bg-purple-900 hover:bg-purple-800 text-white font-semibold text-lg px-6 py-3 rounded-full text-center w-full">{name}</button>
        </div>
    )
}

export default CustomButton;