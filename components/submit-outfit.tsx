import React, { useState } from "react";
import { Form, Input, Button, Card, Select } from "antd";
import axios from "axios";
import type { ProcessedImage } from "../pages/api/process-image";
import { Indicies } from "../util/elastic-indicies";

const processImage = async (url: string) => {
    if (url.includes("http")) {
        return (await axios.post<ProcessedImage>("/api/process-image", { url })).data;
    }
};

type FormData = {
    outfitName: string;
    outfitSource: string;
    tags: string[];
};

export type OutfitData = {
    processedImage?: ProcessedImage;
} & FormData;

const saveOutfit = async (outfit: OutfitData) => {
    await axios.post("/api/save-outfit", {
        index: Indicies.outfit,
        body: outfit,
    });
};

const LoadedOutfitData = ({ processedImage }: { processedImage: ProcessedImage }) => {
    return (
        <>
            <h2>By: {processedImage.creator}</h2>
            {processedImage.outfits.map((outfit, i) => (
                <Form.Item key={i}>
                    <Card cover={<img alt="" style={{ height: "200px", width: "400px" }} src={outfit.image} />}>
                        <Card.Meta
                            description={
                                <>
                                    <div>Creator ID: {outfit.creatorId}</div>
                                    <div>Outfit ID: {outfit.outfitId}</div>
                                </>
                            }
                        ></Card.Meta>
                    </Card>
                </Form.Item>
            ))}
            <Form.Item label="Hashtags">{processedImage.hashtags.join(", ")}</Form.Item>
        </>
    );
};

export const SubmitOutfit = () => {
    const [formValue, updateFormValue] = useState<FormData>({
        outfitName: "",
        outfitSource: "",
        tags: [],
    });
    const [processedImage, setProcessedImage] = useState<ProcessedImage>();
    const [loading, setLoading] = useState(false);

    console.log(formValue);
    return (
        <div>
            <Form initialValues={{}} onValuesChange={(_, formValues) => updateFormValue(formValues as FormData)}>
                <Form.Item label="Outfit Name" name="outfitName">
                    <Input placeholder="That Cute Sweater from Friends" />
                </Form.Item>
                <Form.Item label="Outfit Source" name="outfitSource">
                    <Input.Search
                        placeholder="Twitter, Imgur, Etc"
                        enterButton="Load Outfit"
                        onSearch={async v => {
                            setLoading(true);
                            setProcessedImage(await processImage(v));
                            setLoading(false);
                        }}
                        loading={loading}
                    />
                </Form.Item>
                {processedImage ? <LoadedOutfitData processedImage={processedImage} /> : null}
                <Form.Item label="Tags" name="tags">
                    <Select mode="tags" style={{ width: "100%" }} placeholder="#cool #outfit"></Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" onClick={() => saveOutfit({ ...formValue, processedImage })}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
