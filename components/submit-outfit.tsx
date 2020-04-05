import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import { Indicies } from "../util/elastic-indicies";
import { OutfitCards } from "./outfit-card/outfit-card";
import type { ProcessedImageResponse, OutfitData } from "../pages/api/save-outfit";

const processImage = async (url: string) => {
    if (url.includes("http")) {
        try {
            return (await axios.post<ProcessedImageResponse>("/api/process-image", { url })).data;
        } catch (err) {
            message.error(err.err);
        }
    }
};

const saveOutfit = async (outfit: OutfitData) => {
    await axios.post("/api/save-outfit", {
        index: Indicies.outfit,
        body: outfit,
    });
};

export const SubmitOutfit = () => {
    const [formValue, updateFormValue] = useState<OutfitData>({
        outfitName: "",
        outfitSource: "",
        tags: [],
    });
    const [processedOutfit, setProcessedOutfit] = useState<ProcessedImageResponse>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    console.log(formValue);
    return (
        <div>
            <Form initialValues={{}} onValuesChange={(_, formValues) => updateFormValue(formValues as OutfitData)}>
                <Form.Item label="Outfit Name" name="outfitName">
                    <Input placeholder="That Cute Sweater from Friends" disabled={loading} />
                </Form.Item>
                <Form.Item label="Outfit Source" name="outfitSource">
                    <Input.Search
                        disabled={loading}
                        placeholder="Twitter, Imgur, Etc"
                        enterButton="Load Outfit"
                        onSearch={async v => {
                            setLoading(true);
                            setProcessedOutfit(await processImage(v));
                            setLoading(false);
                        }}
                        loading={loading}
                    />
                </Form.Item>
                {processedOutfit ? <OutfitCards outfits={[{ ...formValue, outfitData: processedOutfit }]} /> : null}
                <Form.Item label="Tags" name="tags">
                    <Select mode="tags" style={{ width: "100%" }} placeholder="#cool #outfit" disabled={loading} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        loading={saving}
                        disabled={!processedOutfit || loading || saving}
                        onClick={() => {
                            setSaving(true);
                            saveOutfit({ ...formValue, outfitData: processedOutfit });
                            setSaving(false);
                        }}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
