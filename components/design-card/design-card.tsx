import React from "react";
import { Row, Col, Card, message, Descriptions, Avatar, Tag, List } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { DesignData } from "../../pages/api/save-design";

type DesignCardProps = { design: DesignData; showUserData?: boolean; duplicate?: boolean };

const parseTwitterDescription = (desc: string) => {
    if (typeof window !== "undefined") {
        const parser = new DOMParser();
        return parser.parseFromString("<!doctype html><body>" + desc, "text/html").body.textContent;
    }
    return desc;
};

const TwitterDescription = ({ description }: { description: string }) => {
    if (description) {
        return <> - {parseTwitterDescription(description)}</>;
    }
    return null;
};

const CardTitle = ({ design, showUserData }: DesignCardProps) => (
    <>{showUserData ? design.designName : "Design Info"}</>
);

export const DesignCard = ({ design, showUserData, duplicate }: DesignCardProps) => {
    return (
        <Card
            style={{ width: 300, border: duplicate ? "3px solid red" : undefined }}
            cover={<img alt={design.designName} src={design.designImage} />}
        >
            <List.Item.Meta
                avatar={design.twitterData?.creator.avatar ? <Avatar src={design.twitterData.creator.avatar} /> : null}
                description={
                    <Descriptions title={<CardTitle design={design} showUserData={showUserData} />} column={1}>
                        {design.twitterData ? (
                            <Descriptions.Item label="Creator">
                                <a target="_blank" href={design.designSource}>
                                    {design.twitterData.creator.screen_name}
                                </a>
                                <TwitterDescription description={design.twitterData.twitterDescription} />
                            </Descriptions.Item>
                        ) : null}
                        <Descriptions.Item label="Creator ID">
                            {design.creatorId}{" "}
                            <CopyOutlined
                                onClick={() => {
                                    navigator.clipboard.writeText(design.creatorId);
                                    message.success("Copied");
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Design ID">
                            {design.designId}{" "}
                            <CopyOutlined
                                onClick={() => {
                                    navigator.clipboard.writeText(design.designId);
                                    message.success("Copied");
                                }}
                            />
                        </Descriptions.Item>
                        {showUserData ? (
                            <Descriptions.Item label="tags">
                                {design.tags.map((tag, n) => (
                                    <Tag color="blue" key={n}>
                                        {tag}
                                    </Tag>
                                ))}
                            </Descriptions.Item>
                        ) : null}
                    </Descriptions>
                }
            />
        </Card>
    );
};

const colSizes = {
    xs: 24,
    sm: 18,
    md: 18,
    lg: 6,
    xl: 4,
};

export const DesignCards = ({ designs, showUserData }: { designs: DesignData[]; showUserData?: boolean }) => {
    return (
        <div style={{ background: "#ECECEC", padding: "30px" }}>
            <Row gutter={16}>
                {designs.map((design, i) => (
                    <Col span={8} key={i} {...colSizes}>
                        <DesignCard showUserData={showUserData} design={design} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};
