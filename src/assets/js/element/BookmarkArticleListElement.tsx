import React from "react";
import Article from "../common/Article";
import Board from "../common/Board";
import DateUtil from "../util/DateUtil";

import "../../css/ArticleListElement.css"
import { FiStar } from "react-icons/fi";

export type Props = {
    board: Board
    article: Article,
    onClick: OnClickArticleListElemenet,
};

interface State {
    isBookmark: boolean,
    haveFile: boolean
};

export type OnClickArticleListElemenet = (article: Article) => void;

class BookmarkArticleListElement extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            isBookmark: true,
            haveFile: props.article.getHaveFile()
        }
    }

    private onClick() {
        this.props.onClick(this.props.article);
    }

    private onClickBookmark() {
        let articleId = 
            `${this.props.board.getId()}-${this.props.article.getId()}`;

        let isBookmark: boolean = !this.state.isBookmark;

        let bookmarkStr = localStorage.getItem("bookmark");
        if(!bookmarkStr)
            bookmarkStr = "{}";
        

        let bookmark = JSON.parse(bookmarkStr);
        let hasArticleId = bookmark.hasOwnProperty(articleId);

        if(isBookmark && !hasArticleId) {
            bookmark[articleId] = {
                "board": this.props.board.toJson(),
                "article": this.props.article.toJson()
            };           
        }
        else if(!isBookmark && hasArticleId) {
            delete bookmark[articleId];
        }

        let newBookmarkStr = JSON.stringify(bookmark);
        localStorage.setItem("bookmark", newBookmarkStr);

        this.setState({ isBookmark });
    }

    public render() {
        let article = this.props.article;
        let board = this.props.board;
        return (
            <div className="article_list_element_container">
                <div className="article_info" onClick={this.onClick.bind(this)} >
                    <div className={`title`}>{article.getTitle()}</div>
                    <div className="date_and_author">[{board.getName()}] {article.getAuthor()} {DateUtil.dateToDateString(article.getDate())}</div>
                </div>
                <div className={`bookmark`} onClick={this.onClickBookmark.bind(this)}>
                    <FiStar style={{
                        "color": `${this.state.isBookmark ? "orange" : "gray"}`,
                        "fontSize": 20 }}/>
                </div>
            </div>
        );
    }
}

export default BookmarkArticleListElement;