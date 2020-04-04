import React from "react";
import { Row, Col, Card, message, Descriptions, Avatar } from "antd";
import { Meta } from "antd/lib/list/Item";
import type { OutfitData } from "../submit-outfit";
import { CopyOutlined } from "@ant-design/icons";

const OutfitCard = ({ outfit }: { outfit: OutfitData }) => {
    return (
        <Row gutter={16}>
            {outfit.processedOutfit.outfits.map(o => (
                <Col span={8}>
                    <Card style={{ width: 300 }} cover={<img alt={outfit.outfitName} src={o.outfitId} />}>
                        <Meta
                            avatar={<Avatar src={outfit.processedOutfit.creator.avatar} />}
                            description={
                                <Descriptions title="Outfit Info" column={1}>
                                    <Descriptions.Item label="Creator">
                                        <a href={outfit.outfitSource}>{outfit.processedOutfit.creator.screen_name}</a> -{" "}
                                        {outfit.outfitName}
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
                                </Descriptions>
                            }
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export const OutfitCards = ({ outfits }: { outfits: OutfitData[] }) => {
    return (
        <div style={{ background: "#ECECEC", padding: "30px" }}>
            {outfits.map((outfit, i) => (
                <OutfitCard key={i} outfit={outfit} />
            ))}
        </div>
    );
};
