import React from "react";
import Board from "../common/Board";
import Article from "../common/Article";
import ArticleListElement, { OnClickArticleListElemenet } from "./ArticleListElement";

import "../../css/BoardBodyElement.css"
import { FiInbox } from "react-icons/fi";
import MainScreen from "../screen/MainScreen";
import UriFormatter from "../common/UriFormatter";
import BookmarkArticleListElement from "./BookmarkArticleListElement";

export type Props = {
    selected: boolean,
    clickDate: Date
};

interface State {
    articleList: Array<Article>,
    articleAndBoard: Map<Article, Board>
}

class BookmarkBodyElement extends React.Component<Props, State> {
    key: number = 0;

    constructor(props: Props) {
        super(props);

        let articleList = new Array<Article>();
        let articleAndBoard = new Map<Article, Board>();

        let bookmarkStr = localStorage.getItem("bookmark");
        let bookmark = JSON.parse(bookmarkStr ? bookmarkStr : "{}");

        for(let key in bookmark as Object) {
            let bookmarkItem = bookmark[key];
            let board = Board.fromJson(bookmarkItem["board"]);
            let article = Article.fromJson(bookmarkItem["article"]);
            
            articleList.push(article);
            articleAndBoard.set(article, board);
        }

        articleList.reverse();

        this.state = {
            articleList,
            articleAndBoard
        };
    }

    public render() {
        return (
            <div className={`board_body_element_container ${this.props.selected ? "selected" : ""}`}>
            {
                this.state.articleList.length > 0
                ? this.state.articleList.map(article => {
                    let board: Board = this.state.articleAndBoard.get(article) as Board;

                    return <BookmarkArticleListElement 
                        key={this.key++}
                        board={board}
                        article={article}
                        onClick={() => {
                            let api = (window as any).api;
                            let uri: string = UriFormatter.recentUriFormatter.getArticleUri(board, article);
                            api.send("openArticle", uri);
                        }}/>;
                })
                : <div className="null">
                    <div className="null_image"><FiInbox /></div>
                    <div className="null_text">북마크에 글이 없습니다</div>
                </div>
            }
            </div>
        );
    }
}

export default BookmarkBodyElement;