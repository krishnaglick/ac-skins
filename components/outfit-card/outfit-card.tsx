import React from "react";
import { Row, Col, Card, message, Descriptions, Avatar, Tag, List } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { OutfitData } from "../../pages/api/save-outfit";

type OutfitCardProps = { outfit: OutfitData; showUserData?: boolean; duplicate?: boolean };

const parseTwitterDescription = (desc: string) => {
    if (typeof window !== "undefined") {
        const parser = new DOMParser();
        return parser.parseFromString("<!doctype html><body>" + desc, "text/html").body.textContent;
    }
    return desc;
};

const CardTitle = ({ outfit, showUserData }: OutfitCardProps) => (
    <>{showUserData ? outfit.outfitName : "Outfit Info"}</>
);

export const OutfitCard = ({ outfit, showUserData, duplicate }: OutfitCardProps) => {
    return (
        <Card
            style={{ width: 300, border: duplicate ? "3px solid red" : undefined }}
            cover={<img alt={outfit.outfitName} src={outfit.outfitImage} />}
        >
            <List.Item.Meta
                avatar={outfit.twitterData ? <Avatar src={outfit.twitterData.creator.avatar} /> : null}
                description={
                    <Descriptions title={<CardTitle outfit={outfit} showUserData={showUserData} />} column={1}>
                        {outfit.twitterData ? (
                            <Descriptions.Item label="Creator">
                                <a target="_blank" href={outfit.outfitSource}>
                                    {outfit.twitterData.creator.screen_name}
                                </a>{" "}
                                - {parseTwitterDescription(outfit.twitterData.twitterDescription)}
                            </Descriptions.Item>
                        ) : null}
                        <Descriptions.Item label="Creator ID">
                            {outfit.creatorId}{" "}
                            <CopyOutlined
                                onClick={() => {
                                    navigator.clipboard.writeText(outfit.creatorId);
                                    message.success("Copied");
                                }}
                            />
                        </Descriptions.Item>
                        <Descriptions.Item label="Outfit ID">
                            {outfit.outfitId}{" "}
                            <CopyOutlined
                                onClick={() => {
                                    navigator.clipboard.writeText(outfit.outfitId);
                                    message.success("Copied");
                                }}
                            />
                        </Descriptions.Item>
                        {showUserData ? (
                            <Descriptions.Item label="tags">
                                {outfit.tags.map((tag, n) => (
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

export const OutfitCards = ({ outfits, showUserData }: { outfits: OutfitData[]; showUserData?: boolean }) => {
    return (
        <div style={{ background: "#ECECEC", padding: "30px" }}>
            <Row gutter={16}>
                {outfits.map((outfit, i) => (
                    <Col span={8} key={i}>
                        <OutfitCard showUserData={showUserData} outfit={outfit} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};
