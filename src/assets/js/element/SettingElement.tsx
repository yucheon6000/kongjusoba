import React from "react";

import "../../css/SettingElement.css";
import { FiArrowUp, FiPlus, FiX } from "react-icons/fi";
import Board, { BoardJson } from "../common/Board";

export type Props = {
    boardList: Array<Board>,
    onConfirm: Function,
    onCancel: Function
};

interface State {
    boardListJson: Array<BoardJson>,
    maxCount: number,
    hiddenClickCount: number
};

const table_row_item_style = { flex: 0.32 };
const table_row_item_button_style = { width: 20 };

class SettingElement extends React.Component<Props, State> {
    private key = 0;

    constructor(props: Props) {
        super(props);

        let boardListJson: Array<BoardJson> = [];
        props.boardList.map(board => {
            boardListJson.push(board.toJson());
        })

        this.state = {
            boardListJson,
            maxCount: 6,
            hiddenClickCount: 0
        };
    }

    private onChange(event: React.ChangeEvent<HTMLInputElement>, index: number, type: string) {
        let target = event.target;
        let value = target.value;
        console.log(value, index, type);

        let boardListJson = [...this.state.boardListJson];
        let boardJson:any = boardListJson[index];
        boardJson[type] = value;

        this.setState({ boardListJson });
    }

    private onClickAddButton() {
        let newLength = this.state.boardListJson.length + 1;
        if (newLength > this.state.maxCount) {
            alert(`등록 가능한 게시판 개수는 총 ${this.state.maxCount}개입니다.`);
            return;
        }

        let boardListJson = [...this.state.boardListJson];
        boardListJson.push({id: "", name: "", shortName: "", lastestArticleId: 0});

        this.setState({ boardListJson });
    }

    private onClickDeleteButton(index: number) {
        let boardListJson = [...this.state.boardListJson];
        boardListJson.splice(index, 1);

        this.setState({ boardListJson });
    }

    private onClickUpButton(index: number) {
        let boardListJson = [...this.state.boardListJson];
        if(index == 0) return;

        let temp = boardListJson[index-1];
        boardListJson[index-1] = boardListJson[index];
        boardListJson[index] = temp;

        this.setState({ boardListJson });
    }


    private onClickHiddenButton() {
        /* 게시판 개수 제한은 학교 사이트의 부하를 막기위해 설계된 기능입니다. */
        /* 본 코드를 보아도 눈 감아주세요. */
        
        let maxCount = this.state.maxCount;
        let hiddenClickCount = this.state.hiddenClickCount + 1;

        if (hiddenClickCount > this.state.maxCount) {
            alert("게시판 개수 제한 해제");
            maxCount = 100;
        }

        this.setState({ maxCount, hiddenClickCount });
    }

    private onCancel() {
        this.props.onCancel();
    }

    private onConfirm() {
        let boardList: Array<Board> = [];

        for(let boardJson of this.state.boardListJson) {
            boardJson.lastestArticleId = 0;
            let board = Board.fromJson(boardJson);
            boardList.push(board);
        }

        this.props.onConfirm(boardList);
    }

    public render(): React.ReactNode {
        return(
            <div className="setting_element">
                <div className="setting_element_container">
                    <div className="subtitle" onClick={this.onClickHiddenButton.bind(this)}>게시판 설정</div>

                    <div className="board_setter_table">
                        <div className="board_setter_table_row header">
                            <div style={table_row_item_style} className="board_setter_table_row_item">아이디</div>
                            <div style={table_row_item_style} className="board_setter_table_row_item">게시판명</div>
                            <div style={table_row_item_style} className="board_setter_table_row_item">짧은 게시판명</div>
                            <div style={table_row_item_button_style} className="board_setter_table_row_item"></div>
                            <div style={table_row_item_button_style} className="board_setter_table_row_item"><button className="plus" onClick={this.onClickAddButton.bind(this)}><FiPlus /></button></div>
                        </div>

                        {
                            this.state.boardListJson.map((boardJson, index) => {
                                return(
                                    <div key={index} className="board_setter_table_row">
                                        <div style={table_row_item_style} className="board_setter_table_row_item"><input type="text" onChange={(e) => { this.onChange(e, index, "id") }} name={`${index}-id`} value={boardJson.id}/></div>
                                        <div style={table_row_item_style} className="board_setter_table_row_item"><input type="text" onChange={(e) => { this.onChange(e, index, "name") }} name={`${index}-name`} value={boardJson.name}/></div>
                                        <div style={table_row_item_style} className="board_setter_table_row_item"><input type="text" onChange={(e) => { this.onChange(e, index, "shortName") }} name={`${index}-shortName`} value={boardJson.shortName}/></div>
                                        <div style={table_row_item_button_style} className="board_setter_table_row_item"><button className="up" onClick={this.onClickUpButton.bind(this, index)}><FiArrowUp /></button></div>
                                        <div style={table_row_item_button_style} className="board_setter_table_row_item"><button onClick={this.onClickDeleteButton.bind(this, index)}><FiX /></button></div>
                                    </div>
                                );
                            })
                        }

                        <div className="caption">
                            설정을 변경하게 되면 기록이 새롭게 시작됩니다.<br/>
                            등록 가능한 게시판 개수는 총 {this.state.maxCount}개입니다.<br/>
                            (현재 게시판 개수: {this.state.boardListJson.length}/{this.state.maxCount}개)
                        </div>

                        <div className="button_group">
                            <button onClick={this.onCancel.bind(this)}>취소</button>
                            <button onClick={this.onConfirm.bind(this)} className="save">저장</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingElement;