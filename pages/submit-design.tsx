import React, { useState, useMemo } from "react";
import { Form, Input, Button, Select, message, Row, Col, Card } from "antd";
import axios from "axios";
import { Indicies } from "../util/elastic-indicies";
import type { ProcessedDesign, DesignData } from "../pages/api/save-design";

const processImage = async (url: string): Promise<ProcessedDesign | null> => {
    if (url.includes("http")) {
        try {
            return (await axios.post<ProcessedDesign>("/api/process-image", { url })).data;
        } catch (err) {
            message.error(err?.response?.data || err.toString());
        }
    }
    return null;
};

const saveDesign = async (design: DesignData) => {
    try {
        const saveData = (
            await axios.post<{ success?: boolean; message?: string }>("/api/save-design", {
                index: design.designType,
                body: design,
            })
        ).data;
        if (saveData.success) {
            message.success(saveData.success);
            return true;
        } else if (saveData.message) {
            message.warn("It looks like that design might exist already!");
            return false;
        }
        message.warn("There was an unknown error saving your design");
    } catch (err) {
        message.error(err.toString());
        return false;
    }
};

const defaultFormData: DesignData = {
    designName: "",
    designSource: "",
    designType: Indicies.Outfit,
    creatorId: "",
    designId: "",
    designImage: "",
    tags: [],
};
Object.freeze(defaultFormData);

const colSizes = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 12,
};

// TODO: Some kinda magic to make this form generate one per image in a tweet
export const SubmitDesign = () => {
    const [formValue, updateFormValue] = useState<DesignData>(defaultFormData);
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const disabled = useMemo(() => loading || saving, [loading, saving]);

    console.log("formValue: ", formValue);

    return (
        <Form
            initialValues={defaultFormData}
            onValuesChange={(_, formValues) => updateFormValue(formValues as DesignData)}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            form={form}
            onSubmitCapture={console.log}
        >
            <Row>
                <Col {...colSizes}>
                    <Form.Item
                        label="Design Name"
                        name="designName"
                        rules={[
                            {
                                required: true,
                                message: "This field is required",
                            },
                        ]}
                    >
                        <Input placeholder="A Cute Jacket" disabled={disabled} />
                    </Form.Item>
                    <Form.Item
                        label="Design Source"
                        name="designSource"
                        rules={[
                            {
                                required: true,
                                message: "This field is required",
                            },
                        ]}
                    >
                        <Input.Search
                            disabled={disabled}
                            placeholder="Twitter, JPG, PNG"
                            enterButton="Load Design"
                            onSearch={async v => {
                                setLoading(true);
                                const processedDesign = await processImage(v);
                                if (processedDesign) {
                                    const newFormValue = { ...formValue, ...processedDesign };
                                    form.setFieldsValue(newFormValue);
                                    updateFormValue(newFormValue); // Setting field values does not trigger onValuesChange
                                }
                                setLoading(false);
                            }}
                            loading={loading}
                        />
                    </Form.Item>
                    <Form.Item label="Tags" name="tags">
                        <Select
                            mode="tags"
                            style={{ width: "100%" }}
                            placeholder="Cute Jacket"
                            disabled={disabled}
                            notFoundContent=""
                            dropdownStyle={{ display: "none" }}
                            onChange={updatedTags => {
                                const values = { ...formValue, tags: updatedTags };
                                form.setFieldsValue(values);
                                updateFormValue(values as DesignData);
                            }}
                        />
                        <span>Press enter to add a tag</span>
                    </Form.Item>
                </Col>
                <Col {...colSizes}>
                    <Form.Item
                        label="Design ID"
                        name="designId"
                        rules={[
                            {
                                required: true,
                                message: "This field is required",
                            },
                        ]}
                    >
                        <Input placeholder="MO-XXXX-XXXX-XXXX" disabled={disabled} />
                    </Form.Item>
                    <Form.Item
                        label="Creator ID"
                        name="creatorId"
                        rules={[
                            {
                                required: true,
                                message: "This field is required",
                            },
                        ]}
                    >
                        <Input placeholder="MA-XXXX-XXXX-XXXX" disabled={disabled} />
                    </Form.Item>
                    <Form.Item
                        label="Design Type"
                        name="designType"
                        rules={[
                            {
                                required: true,
                                message: "This field is required",
                            },
                        ]}
                    >
                        <Select disabled={disabled}>
                            {Object.entries(Indicies).map(([key, value], i) => (
                                <Select.Option key={i} value={value}>
                                    {key}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {formValue.designImage ? (
                        <Form.Item label="Design">
                            <Card
                                size="small"
                                style={{ width: 300 }}
                                cover={<img alt={formValue.designName} src={formValue.designImage} />}
                            />
                        </Form.Item>
                    ) : null}
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            loading={saving}
                            disabled={disabled}
                            onClick={() => {
                                console.log(form.getFieldsError());
                                form.validateFields()
                                    .then(async () => {
                                        setSaving(true);
                                        const saveSuccess = await saveDesign(formValue);
                                        if (saveSuccess) {
                                            updateFormValue(defaultFormData);
                                            form.resetFields();
                                        }
                                        setSaving(false);
                                    })
                                    .catch(console.error);
                            }}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default SubmitDesign;
