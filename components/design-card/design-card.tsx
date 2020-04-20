import React, { useState, useEffect } from "react";
import { Row, Col, Card, message, Descriptions, Avatar, Tag, List } from "antd";
import { CopyOutlined, ShareAltOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import { DesignData } from "../../pages/api/save-design";
import { favorites } from "../../util/favorites";

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
        return <span suppressHydrationWarning={true}> - {parseTwitterDescription(description)}</span>;
    }
    return null;
};

const CardTitle = ({ design, showUserData }: DesignCardProps) => (
    <>{showUserData ? design.designName : "Design Info"}</>
);

export const DesignCard = ({ design, showUserData }: DesignCardProps) => {
    const [cardFavorited, favorite] = useState(false);
    useEffect(() => {
        // Calling this in here because setting the value in useState caused reconciliation issues
        favorite(favorites.hasFavorite(design));
    }, []);
    useEffect(() => {
        if (!favorites.hasFavorite(design) && cardFavorited) {
            favorites.addFavorite(design);
        } else if (favorites.hasFavorite(design) && !cardFavorited) {
            favorites.removeFavorite(design);
        }
    }, [cardFavorited]);
    return (
        <Card
            cover={<img alt={design.designName} src={design.designImage} />}
            actions={[
                <ShareAltOutlined
                    key="share"
                    onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?search=${design.designId}`;
                        navigator.clipboard.writeText(shareUrl);
                        message.success("Share URL copied to clipboard: " + shareUrl);
                    }}
                />,
                cardFavorited ? (
                    <StarFilled key="favorite" onClick={() => favorite(!cardFavorited)} />
                ) : (
                    <StarOutlined key="favorite" onClick={() => favorite(!cardFavorited)} />
                ),
            ]}
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
    sm: 24,
    md: 12,
    lg: 8,
    xl: 6,
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
