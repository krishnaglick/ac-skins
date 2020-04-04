import React from "react";
import { Row, Col, Card, message, Descriptions, Avatar, Tag } from "antd";
import { Meta } from "antd/lib/list/Item";
import type { OutfitData } from "../submit-outfit";
import { CopyOutlined } from "@ant-design/icons";

type OutfitCardProps = { outfit: OutfitData; showUserData?: boolean };

const CardTitle = ({ outfit, showUserData }: OutfitCardProps) => (
    <>Outfit Info{showUserData ? ` - ${outfit.outfitName}` : ""}</>
);

const OutfitCard = ({ outfit, showUserData }: OutfitCardProps) => {
    return (
        <Row gutter={16}>
            {outfit.processedOutfit.outfits.map((o, i) => (
                <Col key={i} span={8}>
                    <Card style={{ width: 300 }} cover={<img alt={outfit.outfitName} src={o.outfitImage} />}>
                        <Meta
                            avatar={<Avatar src={outfit.processedOutfit.creator.avatar} />}
                            description={
                                <Descriptions
                                    title={<CardTitle outfit={outfit} showUserData={showUserData} />}
                                    column={1}
                                >
                                    <Descriptions.Item label="Creator">
                                        <a href={outfit.outfitSource}>{outfit.processedOutfit.creator.screen_name}</a> -{" "}
                                        {outfit.processedOutfit.description}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Creator ID">
                                        {o.creatorId}{" "}
                                        <CopyOutlined
                                            onClick={() => {
                                                navigator.clipboard.writeText(o.creatorId);
                                                message.success("Copied");
                                            }}
                                        />
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Outfit ID">
                                        {o.outfitId}{" "}
                                        <CopyOutlined
                                            onClick={() => {
                                                navigator.clipboard.writeText(o.outfitId);
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
                </Col>
            ))}
        </Row>
    );
};

export const OutfitCards = ({ outfits, showUserData }: { outfits: OutfitData[]; showUserData?: boolean }) => {
    return (
        <div style={{ background: "#ECECEC", padding: "30px" }}>
            {outfits.map((outfit, i) => (
                <OutfitCard showUserData={showUserData} key={i} outfit={outfit} />
            ))}
        </div>
    );
};
