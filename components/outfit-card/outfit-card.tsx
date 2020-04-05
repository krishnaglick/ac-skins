import React from "react";
import { Row, Col, Card, message, Descriptions, Avatar, Tag, List } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { OutfitData } from "../../pages/api/save-outfit";
import { isTwitterOutfit } from "../../util/typeguards";

type OutfitCardProps = { outfit: OutfitData; showUserData?: boolean };

const CardTitle = ({ outfit, showUserData }: OutfitCardProps) => (
    <>{showUserData ? outfit.outfitName : "Outfit Info"}</>
);

const OutfitCard = ({ outfit, showUserData }: OutfitCardProps) => {
    console.log("outfit: ", outfit);
    return (
        <Row gutter={16}>
            {outfit.outfitData?.processedOutfits?.map((o, i) => (
                <Col key={i} span={8}>
                    <Card style={{ width: 300 }} cover={<img alt={outfit.outfitName} src={o.outfitImage} />}>
                        <List.Item.Meta
                            avatar={
                                isTwitterOutfit(outfit.outfitData) ? (
                                    <Avatar src={outfit.outfitData.creator.avatar} />
                                ) : null
                            }
                            description={
                                <Descriptions
                                    title={<CardTitle outfit={outfit} showUserData={showUserData} />}
                                    column={1}
                                >
                                    {isTwitterOutfit(outfit.outfitData) ? (
                                        <Descriptions.Item label="Creator">
                                            <a target="_blank" href={outfit.outfitSource}>
                                                {outfit.outfitData.creator.screen_name}
                                            </a>{" "}
                                            - {outfit.outfitData.twitterDescription}
                                        </Descriptions.Item>
                                    ) : null}
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
