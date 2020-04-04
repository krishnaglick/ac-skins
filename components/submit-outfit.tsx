import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import axios from "axios";
import type { ProcessedOutfit } from "../pages/api/process-image";
import { Indicies } from "../util/elastic-indicies";
import { OutfitCards } from "./outfit-card/outfit-card";

const processImage = async (url: string) => {
    if (url.includes("http")) {
        try {
            return (await axios.post<ProcessedOutfit>("/api/process-image", { url })).data;
        } catch (err) {
            message.error(err.err);
        }
    }
};

type FormData = {
    outfitName: string;
    outfitSource: string;
    tags: string[];
};

export type OutfitData = {
    processedOutfit: ProcessedOutfit;
} & FormData;

const saveOutfit = async (outfit: OutfitData) => {
    await axios.post("/api/save-outfit", {
        index: Indicies.outfit,
        body: outfit,
    });
};

export const SubmitOutfit = () => {
    const [formValue, updateFormValue] = useState<FormData>({
        outfitName: "",
        outfitSource: "",
        tags: [],
    });
    const [processedOutfit, setProcessedOutfit] = useState<ProcessedOutfit>();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    console.log(formValue);
    return (
        <div>
            <Form initialValues={{}} onValuesChange={(_, formValues) => updateFormValue(formValues as FormData)}>
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
                {processedOutfit ? <OutfitCards outfits={[{ ...formValue, processedOutfit }]} /> : null}
                <Form.Item label="Tags" name="tags">
                    <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        placeholder="#cool #outfit"
                        disabled={loading}
                    ></Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        loading={saving}
                        disabled={!processedOutfit || loading || saving}
                        onClick={() => {
                            setSaving(true);
                            saveOutfit({ ...formValue, processedOutfit: processedOutfit! });
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
