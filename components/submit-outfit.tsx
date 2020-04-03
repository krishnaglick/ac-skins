import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";

const processImage = async (url: string) => {
    if (url.includes("http")) {
        console.log(await axios.post("/api/process-image", { url }));
    }
};

const saveOutfit = async (outfit: {}) => {
    await axios.post("/api/save-outfit", outfit);
};

// type SubmitOutfitState = {
//     title: string;
// };

// export class cSubmitOutfit extends React.Component<{}, SubmitOutfitState> {}

export const SubmitOutfit = () => {
    const [formValue, updateFormValue] = useState({});

    console.log(formValue);
    return (
        <div>
            <Form initialValues={{}} onValuesChange={(_, formValues) => updateFormValue(formValues)}>
                <Form.Item label="outfitName" name="outfitName">
                    <Input placeholder="That Cute Sweater from Friends" />
                </Form.Item>
                <Form.Item label="outfitSource" name="outfitSource">
                    <Input.Search placeholder="Twitter, Imgur, Etc" enterButton="Load Outfit" onSearch={processImage} />
                    <span>Image hosting is expensive!</span>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" onClick={() => saveOutfit(formValue)}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
