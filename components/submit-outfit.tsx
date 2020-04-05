import React, { useState } from "react";
import { Form, Input, Button, Select, message, Row } from "antd";
import axios from "axios";
import { Indicies } from "../util/elastic-indicies";
import { OutfitCard } from "./outfit-card/outfit-card";
import type { ProcessedImageResponse, OutfitData } from "../pages/api/save-outfit";
import { ElasticOutfitData } from "./outfit-search";

const processImage = async (url: string) => {
    if (url.includes("http")) {
        try {
            return (await axios.post<ProcessedImageResponse>("/api/process-image", { url })).data;
        } catch (err) {
            message.error(err.err);
        }
    }
};

const saveOutfit = async (
    outfit: OutfitData,
    setDupe: React.Dispatch<React.SetStateAction<OutfitData | undefined>>,
) => {
    try {
        const saveData = (
            await axios.post<{ success?: string; duplicate?: ElasticOutfitData }>("/api/save-outfit", {
                index: Indicies.outfit,
                body: outfit,
            })
        ).data;
        if (saveData.success) {
            return message.success(saveData.success);
        } else if (saveData.duplicate) {
            message.warn("It looks like that outfit might exist already!");
            return setDupe(saveData.duplicate._source);
        }
        message.warn("There was an unknown error saving your outfit");
    } catch (err) {
        message.error(err.toString());
    }
};

export const SubmitOutfit = () => {
    const [formValue, updateFormValue] = useState<OutfitData>({
        outfitName: "",
        outfitSource: "",
        tags: [],
    });
    const [processedOutfit, setProcessedOutfit] = useState<ProcessedImageResponse>();
    const [duplicate, setDupe] = useState<OutfitData>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

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
                {processedOutfit || duplicate ? (
                    <Row gutter={16}>
                        {processedOutfit ? <OutfitCard outfit={{ ...formValue, outfitData: processedOutfit }} /> : null}
                        {duplicate ? <OutfitCard outfit={duplicate} showUserData={true} duplicate={true} /> : null}
                    </Row>
                ) : null}
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
                            saveOutfit({ ...formValue, outfitData: processedOutfit }, setDupe);
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
