import { Input } from "antd";
import { CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";

interface TextInputProps {
    type: string,
    placeHolder: string;
    value: string;
    validate: boolean,
    onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ type, placeHolder, value, validate, onChange }) => {
    const [input, setInput] = useState('');

    const onChangeText = (e: any) => {
        if (type === "signUp") {
            setInput(e.split("buymeapi.com/")[1] ? e.split("buymeapi.com/")[1] : "");
        }
        else {
            setInput(e);
        }
        onChange(e)
    }
    return (
        <div className="relative">
            <Input
                className={`h-[48px] border ${!validate && input != "" && input.length >= 5 && "border-[#F64B3C]"}`}
                size="large"
                placeholder={placeHolder}
                value={value}
                onChange={(e) => { onChangeText(e.target.value) }}
            />
            {validate && input != "" && input.length >= 5 && <CircleCheck color="#21BF73" className="absolute right-3 top-3" />}
            {!validate && input != "" && input.length >= 5 && <CircleX color="#F64B3C" className="absolute right-3 top-3" />}
        </div>
    );
};

export default TextInput;
