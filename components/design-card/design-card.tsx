import React /* , { useState, useEffect } */ from "react";
import { Card /* , message, Descriptions, Avatar, Tag, List */ } from "antd";
// import {
//     CopyOutlined,
//     ShareAltOutlined,
//     StarFilled,
//     StarOutlined,
//     LeftCircleFilled,
//     RightCircleFilled,
// } from "@ant-design/icons";
import { /* DesignData, */ ProcessedImage } from "../../pages/api/save-design";
// import { favorites } from "../../util/favorites";

// type DesignCardProps = { design: DesignData; showUserData?: boolean; showActions?: boolean };

// const parseTwitterDescription = (desc: string) => {
//     if (typeof window !== "undefined") {
//         const parser = new DOMParser();
//         return parser.parseFromString("<!doctype html><body>" + desc, "text/html").body.textContent;
//     }
//     return desc;
// };

// const TwitterDescription = ({ description }: { description: string }) => {
//     if (description) {
//         return <span suppressHydrationWarning={true}> - {parseTwitterDescription(description)}</span>;
//     }
//     return null;
// };

// const CardTitle = ({ design, showUserData }: DesignCardProps) => (
//     <>{showUserData ? design.designName : "Design Info"}</>
// );

type CardBaseProps = {
    design: ProcessedImage;
    actions?: React.ReactNode[];
};
export const CardBase: React.FunctionComponent<CardBaseProps> = ({ design, actions, children }) => {
    return (
        <Card cover={<img alt={design.designId} src={design.image} />} actions={actions}>
            {children}
        </Card>
    );
};

// export const DesignCard = ({
//     design,
//     showUserData,
//     showActions = true,
// }: {
//     design: ProcessedImage;
//     showUserData: boolean;
//     showActions?: boolean;
// }) => {
//     const [cardFavorited, favorite] = useState(false);
//     const [activeImage, changeImage] = useState(0);
//     useEffect(() => {
//         // Calling this in here because setting the value in useState caused reconciliation issues
//         favorite(favorites.hasFavorite(design));
//     }, []);
//     useEffect(() => {
//         if (!favorites.hasFavorite(design) && cardFavorited) {
//             favorites.addFavorite(design);
//         } else if (favorites.hasFavorite(design) && !cardFavorited) {
//             favorites.removeFavorite(design);
//         }
//     }, [cardFavorited]);
//     return (
//         <Card
//             cover={<img alt={design.designId} src={design.image} />}
//             actions={[
//                 <LeftCircleFilled key="left" onClick={() => changeImage(activeImage - 1 <= 0 ? 0 : activeImage - 1)} />,
//                 ...[
//                     <ShareAltOutlined
//                         key="share"
//                         onClick={() => {
//                             const shareUrl = `${window.location.origin}${window.location.pathname}?search=${design.designId}`;
//                             navigator.clipboard.writeText(shareUrl);
//                             message.success("Share URL copied to clipboard: " + shareUrl);
//                         }}
//                     />,
//                     cardFavorited ? (
//                         <StarFilled key="favorite" onClick={() => favorite(!cardFavorited)} />
//                     ) : (
//                         <StarOutlined key="favorite" onClick={() => favorite(!cardFavorited)} />
//                     ),
//                 ].filter(() => showActions),
//                 <RightCircleFilled
//                     key="right"
//                     onClick={() =>
//                         changeImage(
//                             activeImage + 1 >= design.processedImages.length - 1
//                                 ? design.processedImages.length - 1
//                                 : activeImage + 1,
//                         )
//                     }
//                 />,
//             ]}
//         >
//             <List.Item.Meta
//                 avatar={design.twitterData?.creator.avatar ? <Avatar src={design.twitterData.creator.avatar} /> : null}
//                 description={
//                     <Descriptions title={<CardTitle design={design} showUserData={showUserData} />} column={1}>
//                         {design.twitterData ? (
//                             <Descriptions.Item label="Creator">
//                                 <a target="_blank" href={design.designSource}>
//                                     {design.twitterData.creator.screen_name}
//                                 </a>
//                                 <TwitterDescription description={design.twitterData.twitterDescription} />
//                             </Descriptions.Item>
//                         ) : null}
//                         <Descriptions.Item label="Creator ID">
//                             {design.processedImages[activeImage].creatorId}{" "}
//                             <CopyOutlined
//                                 onClick={() => {
//                                     navigator.clipboard.writeText(design.processedImages[activeImage].creatorId);
//                                     message.success("Copied");
//                                 }}
//                             />
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Design ID">
//                             {design.processedImages[activeImage].designId}{" "}
//                             <CopyOutlined
//                                 onClick={() => {
//                                     navigator.clipboard.writeText(design.processedImages[activeImage].designId);
//                                     message.success("Copied");
//                                 }}
//                             />
//                         </Descriptions.Item>
//                         {showUserData ? (
//                             <Descriptions.Item label="tags">
//                                 {design.tags.map((tag: any, n: number) => (
//                                     <Tag color="blue" key={n}>
//                                         {tag}
//                                     </Tag>
//                                 ))}
//                             </Descriptions.Item>
//                         ) : null}
//                     </Descriptions>
//                 }
//             />
//         </Card>
//     );
// };

// const colSizes = {
//     xs: 24,
//     sm: 24,
//     md: 12,
//     lg: 8,
//     xl: 6,
// };

// const pageSize = 8;

// export const DesignCards = ({
//     designs,
//     showUserData,
//     colSizesOverride,
//     showActions = true,
// }: {
//     designs: DesignData[];
//     showUserData?: boolean;
//     colSizesOverride?: { [key: string]: number };
//     showActions?: boolean;
// }) => {
//     const [page, setPage] = useState(0);
//     const pageOffset = page * pageSize;

//     return (
//         <div style={{ background: "#ECECEC", padding: "30px" }}>
//             {designs.length > pageSize ? (
//                 <Pagination
//                     current={page + 1}
//                     pageSize={pageSize}
//                     total={designs.length}
//                     onChange={pageNumber => setPage(pageNumber - 1)}
//                 />
//             ) : null}
//             <Row gutter={16}>
//                 {designs.slice(pageOffset, pageOffset + pageSize).map((design, i) => (
//                     <Col span={8} key={i} {...{ ...colSizes, ...colSizesOverride }}>
//                         <DesignCard showUserData={showUserData} design={design} showActions={showActions} />
//                     </Col>
//                 ))}
//             </Row>
//         </div>
//     );
// };
