import React, { useState } from "react";
import { Layout, Form, Input, Button } from "antd";
import axios from "axios";

const processImage = async (url: string) => {
    if (url.includes("http")) {
        await axios.post("/api/process-image", { url });
    }
};

export const SubmitOutfit = () => {
    const [imageUrl, setImageUrl] = useState("");

    return (
        <Layout>
            <Form>
                <Form.Item label="outfitName">
                    <Input placeholder="That Cute Sweater from Friends" />
                </Form.Item>
                <Form.Item label="outfitSource">
                    <Input placeholder="Twitter, Imgur, Etc" onChange={e => setImageUrl(e.target.value)} />
                    <span>Image hosting is expensive!</span>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" onClick={() => processImage(imageUrl)}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Layout>
    );
};
