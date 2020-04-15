import React from "react";
import { Input } from "antd";
import axios from "axios";
import { DesignCards } from "../components/design-card/design-card";
import type { DesignData } from "./api/save-design";
import type { ElasticRecord } from "../util/elastic";
import { withRouter } from "next/router";
import { WithRouterProps } from "next/dist/client/with-router";

const getSearchUrl = (searchTerm: string) => {
    const apiPath = `/api/get-designs?search=${searchTerm}`;
    if (typeof process !== "undefined" && process?.env?.NODE_ENV === "development") {
        return "http://localhost:3000" + apiPath;
    }
    return apiPath;
};

const searchDesigns = async (searchTerm: string) => {
    try {
        const { data } = await axios.get<ElasticRecord<DesignData>[]>(getSearchUrl(searchTerm));
        return data.sort((a, b) => a._score - b._score).map(({ _source }) => _source);
    } catch (err) {
        console.error(err);
        return [];
    }
};
type Context = { search?: string | string[] };
const getSearchParam = (context: Context) =>
    context.search ? (Array.isArray(context.search) ? context.search[0] : context.search) : "";

interface DesignSearchProps extends WithRouterProps {
    designs: DesignData[];
    searchValue: string;
}

interface DesignSearchState {
    searching: boolean;
    designs: DesignData[];
    searchValue: string;
}

class DesignSearch extends React.Component<DesignSearchProps, DesignSearchState> {
    constructor(props: DesignSearchProps) {
        super(props);

        props.router.events?.on("routeChangeComplete", this.handleRouteChange);

        this.state = {
            searching: false,
            designs: props.designs,
            searchValue: props.searchValue,
        };
    }

    setSearching = (searching: boolean) => this.setState({ searching });
    setDesigns = (designs: DesignData[]) => this.setState({ designs });

    handleRouteChange = async (url: string) => {
        const searchValue = url.split("=")[1];
        if (searchValue !== this.state.searchValue) {
            const designs = await searchDesigns(searchValue);
            this.setState({ designs, searchValue });
        }
    };

    componentWillUnmount() {
        this.props.router.events?.off("routeChangeComplete", this.handleRouteChange);
    }

    render() {
        const { searching, searchValue, designs } = this.state;
        return (
            <div>
                <Input.Search
                    placeholder="Enter a tag or search term"
                    enterButton="Search"
                    loading={searching}
                    disabled={searching}
                    defaultValue={searchValue}
                    onSearch={async v =>
                        this.props.router.replace(
                            this.props.router.asPath,
                            `/design-search${v ? `?search=${v}` : ""}`,
                            { shallow: true },
                        )
                    }
                />
                {designs.length ? <DesignCards designs={designs} showUserData={true} /> : null}
            </div>
        );
    }
}

export async function getServerSideProps(context: { query: Context }) {
    const searchValue = getSearchParam(context.query);

    if (searchValue) {
        const designs = await searchDesigns(searchValue);
        return { props: { designs, searchValue } };
    }

    return { props: { designs: [], searchValue } };
}

export default withRouter(DesignSearch);
