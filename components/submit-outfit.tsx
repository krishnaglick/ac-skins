import React, { useState, useMemo } from "react";
import { Form, Input, Button, Select, message, Row, Col, Card } from "antd";
import axios from "axios";
import { Indicies } from "../util/elastic-indicies";
import type { ProcessedOutfit, OutfitData } from "../pages/api/save-outfit";

const processImage = async (url: string): Promise<ProcessedOutfit> => {
    if (url.includes("http")) {
        try {
            return (await axios.post<ProcessedOutfit>("/api/process-image", { url })).data;
        } catch (err) {
            message.error(err.err);
        }
    }
    return {} as ProcessedOutfit;
};

const saveOutfit = async (outfit: OutfitData) => {
    try {
        const saveData = (
            await axios.post<{ success?: string; duplicate?: any }>("/api/save-outfit", {
                index: Indicies.outfit,
                body: outfit,
            })
        ).data;
        if (saveData.success) {
            return message.success(saveData.success);
        } else if (saveData.duplicate) {
            return message.warn("It looks like that outfit might exist already!");
        }
        message.warn("There was an unknown error saving your outfit");
    } catch (err) {
        message.error(err.toString());
    }
};

export const SubmitOutfit = () => {
    const [form] = Form.useForm();
    const [formValue, updateFormValue] = useState<OutfitData>({
        outfitName: "",
        outfitSource: "",
        creatorId: "",
        outfitId: "",
        outfitImage: "",
        tags: [],
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const disabled = useMemo(() => loading || saving, [loading, saving]);

    return (
        <Form
            initialValues={{}}
            onValuesChange={(_, formValues) => updateFormValue(formValues as OutfitData)}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            form={form}
        >
            <Row>
                <Col span="12">
                    <Form.Item label="Outfit Name" name="outfitName">
                        <Input placeholder="A Cute Jacket" disabled={disabled} required={true} />
                    </Form.Item>
                    <Form.Item label="Outfit Source" name="outfitSource">
                        <Input.Search
                            disabled={disabled}
                            required={true}
                            placeholder="Twitter, Imgur, Etc"
                            enterButton="Load Outfit"
                            onSearch={async v => {
                                setLoading(true);
                                const processedOutfit = await processImage(v);
                                const newFormValue = { ...formValue, ...processedOutfit };
                                form.setFieldsValue(newFormValue);
                                updateFormValue(newFormValue); // Setting field values does not trigger onValuesChange
                                setLoading(false);
                            }}
                            loading={loading}
                        />
                    </Form.Item>
                    <Form.Item label="Tags" name="tags">
                        <Select mode="tags" style={{ width: "100%" }} placeholder="#cool #outfit" disabled={disabled} />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            loading={saving}
                            disabled={disabled}
                            onClick={() => {
                                setSaving(true);
                                saveOutfit(formValue);
                                setSaving(false);
                            }}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
                <Col span="12">
                    <Form.Item label="Outfit ID" name="outfitId">
                        <Input placeholder="MO-XXXX-XXXX-XXXX" disabled={disabled} required={true} />
                    </Form.Item>
                    <Form.Item label="Creator ID" name="creatorId">
                        <Input placeholder="MO-XXXX-XXXX-XXXX" disabled={disabled} required={true} />
                    </Form.Item>
                    {formValue.outfitImage ? (
                        <Form.Item label="Outfit">
                            <Card
                                size="small"
                                style={{ width: 300 }}
                                cover={<img alt={formValue.outfitName} src={formValue.outfitImage} />}
                            />
                        </Form.Item>
                    ) : null}
                </Col>
            </Row>
        </Form>
    );
};
