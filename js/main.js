(function() {
    'use strict';

    var app = new Vue({
        el: '#app',
        data: {
            //タスク名取得
            newItem: '',
            //期日取得
            newDay: '',
            //日付取得
            today: '',
            //エラー文言格納
            errors: [],
            items: [],
            sortNumber: 1,
            //編集フォームを非表示
            formEdit: false,
            //編集フォームの番号取得
            formIndex: '',
            //編集フォームのタスク取得
            formTitle: '',
            //編集フォームの期日取得
            formDay: '',
            status: [
                {value: 0, name: '未着手'},
                {value: 1, name: '作業中'},
                {value: 2, name: '完了'},
            ]
        },
        watch: {
            items: {
              handler: function() {
                localStorage.setItem('items', JSON.stringify(this.items));
              },
              deep: true
            }
        },
        mounted: function() {
            this.items = JSON.parse(localStorage.getItem('items')) || [];
        },
        methods: {
            addItem: function() {  
                // 追加されたタスクを格納
                let item = {
                    title: this.newItem,
                    today: this.newDay
                }

                let allDelete = document.querySelector('.all-delete');
                // 何も文字が入っていなければエラーを出す。
                this.errors = [];
                if(!this.newItem && !this.newDay) {
                    return this.errors.push('フォームに値が入っていません','日付が指定されていません');
                } else if (!this.newItem) {
                    return this.errors.push('フォームに値が入っていません');
                } else if (!this.newDay) {
                    return this.errors.push('日付が指定されていません');
                }
                // 一覧に追加
                this.items.push(item);
                // 「すべて削除」ボタンについてるクラスを削除
                allDelete.classList.remove('inactive');
                // 空に戻す
                this.newItem ='';
            },
            deleteBtn: function(index) {
                // 削除ボタンを押した際にアラートを出す。
                if(confirm('削除しますか？')) {
                    this.items.splice(index,1);
                }
            },
            //すべて削除ボタンの動作
            allDeleteBtn: function() {
                //すべて削除ボタンを取得
                let allDelete = document.querySelector('.all-delete');
                 //inactive　クラスがついていたらここで終わる
                if(allDelete.classList.contains('inactive')) {
                    return;
                }

                const listNode = document.querySelector('.list');
                if(confirm('すべて削除しますか?')) {
                    while(listNode.firstChild){
                        listNode.removeChild(listNode.firstChild);
                    }
                    //inactive　クラスをつける
                    allDelete.classList.add('inactive');
                    return this.items = [];
                }
            },
            statusBtn: function(index) {
                // ステータスボタンクラス取得
                let statusBtn = document.querySelectorAll('.item__status')[index];

                if(statusBtn.classList.contains('before') == true) {
                    statusBtn.classList.add('now');
                    statusBtn.classList.remove('before');
                    statusBtn.textContent ="進行中";
                } else if (statusBtn.classList.contains('now') == true) {
                    statusBtn.classList.add('finish');
                    statusBtn.classList.remove('now');
                    statusBtn.textContent ="完了";
                } else if (statusBtn.classList.contains('finish') == true) {
                    statusBtn.classList.add('before');
                    statusBtn.classList.remove('finish');
                    statusBtn.textContent ="未着手";
                }
                
            },
            //編集ボタンを押したときの挙動
            editBtn: function(index) {
                this.formEdit = true;
                this.formIndex = index;
                this.formTitle =　this.items[index].title;
                this.formDay = this.items[index].today;
            },
            //保存ボタンを押したときの挙動
            saveBtn: function(formIndex) {
                this.items.splice(formIndex,1,{ title:this.formTitle, today:this.formDay});
                this.formEdit = false;
            },
            //キャンセルボタンを押したときの挙動
            cancleBtn: function() {
                this.formEdit = false;
            }
        },
        //今日の日付を形式を変更して取得
        created: function(){
            let today = new Date();
            let YYYY = today.getFullYear();
            var MM = ('0' + (today.getMonth()+1)).slice(-2);
            var DD = ('0' + today.getDate()).slice(-2);
            this.today = YYYY + '-' + MM + '-' + DD
        },
    });	
})();