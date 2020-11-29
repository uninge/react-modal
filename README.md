# react-fantasy-modal

Powerful modal dialog component for React.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API documentation](#api-documentation)
* [Demos](#demos)
* [TODOS](#todos)

## Installation

尚在开发完善，暂时没发npm。

## Usage
```typescript jsx
import React from 'react';
import Modal from 'react-fantasy-modal';
import 'react-fantasy-modal/dist/index.css';
function onHandleMove(e) {
    console.log(e, '--->>> onHandleMove');
}
function onHandleResize(e) {
    console.log(e, '--->>> onHandleResize');
}


function onHandleOk() {
    console.log('onOk callback')
}

function onHandleCancel() {
    console.log('onCancel callback')
}


<Modal
    visible
    keyboard
    draggable
    resizable

    title="Hello Modal"
    cancelText={"自定义取消文字"}
    okText={"自定义确定文字"}

    onMove={onHandleMove}
    onResize={onHandleResize}
    onCancel={onHandleCancel}
    onOk={onHandleOk}
    onStageChange={console.log}
>
    Hello Modal!
</Modal>
```
 
## API documentation
| 属性                            | 说明             | 类型                     | 默认值                   |
| ------------------------------ | --------------- | ----------------------- | ----------------------- |
| appendContainer                | 设置 Modal 的 z-index                                          | number         | - |
| visible                        | 对话框是否可见                                                   | boolean | - |
| theme                          | 皮肤(内置dark可选)                                               | string  | -  |  
| keyboard                       | 是否支持键盘事件(关闭、移动、缩放、最大最小化)                      | boolean        | - |
| mask                           | 是否展示遮罩                                                     | boolean       | true |
| maskStyle                      | 遮罩样式                                                        | CSSProperties | - |
| maskClassName                  | 遮罩class                                                     | string         | - |
| maskClosable                   | 点击蒙层是否允许关闭	                                            | boolean        | true |
| shouldUpdateOnDrag             | 拖拽过程是否允许视图元素更新                                       | boolean        | false |
| stage                          | 对话框展示状态，默认(DEFAULT)、最大化(FULLSCREEN)、最小化(MINIMIZED) | string         | DEFAULT |
| onCancel                       | 点击遮罩层或右上角叉或取消按钮的回调	                                | function(e)    | - |
| onOk                           | 点击确定回调	                                                | function(e)    | - |
| draggable                      | 对话框是否可拖拽(只支持标题部分拖拽)                                 | boolean       | true |
| resizable                      | 对话框是否可缩放                                                 | boolean       | true |
| stageChangeByDoubleClick       | 对话框是否可通过双击改变状态                                       | boolean        | true |
| onMove                         | 拖动对话框的回调                                                 | function(e)    | - |
| onResize                       | 缩放对话框的回调                                                 | function(e)    | - |
| onStageChange                  | 对话框状态改变的回调                                              | function(e)    | - |
| style                          | 可用于设置对话框样式，调位置等                                      | CSSProperties  | - |
| className                      | 对话框容器的类名	                                            | string         | - |
| width                          | 对话框宽度(受控属性，缩放将无效)                                    | number         | - |
| height                         | 对话框高度(受控属性，缩放将无效)                                    | number         | - |
| top                            | 对话框距离顶部位置(受控属性，垂直拖动将无效)                          | number          | - |
| left                           | 对话框距离左侧位置(受控属性，水平拖动将无效)                          | number          | - |
| initialWidth                   | 对话框初始宽度                                                  | number          | - |
| initialHeight                  | 对话框初始高度                                                  | number          | - |
| initialTop                     | 对话框初始距离顶部位置                                            | number          | - |
| initialLeft                    | 对话框初始距离左侧位置                                            | number          | - |
| minWidth                       | 对话框最小宽度                                                  | number          | 256 |
| minHeight                      | 对话框最小高度                                                  | number          | 256 |
| zIndex                         | 设置 Modal 的 z-index                                         | number          | 1000 |
| title                          | 标题                                                          | ReactNode       | - |
| titleBarClassName              | 对话框标题容器的类名                                             | string           | - |
| minimizeButton                 | 自定义最小化图标                                                | ReactNode        | - |
| maximizeButton                 | 自定义最大化图标                                                | ReactNode        | - |
| restoreButton                  | 自定义复原图标                                                  | ReactNode        | - |
| closeButton                    | 自定义关闭图标                                                  | ReactNode        | - |
| contentClassName               | 对话框内容容器类名                                               | string          | - |
| footerClassName                | 对话框底部容器类名                                               | string          | - |
| showCancel                     | 取消按钮是否可见                                                | boolean          | true |
| showOk                         | 确定按钮是否可见                                                | boolean          | true |
| cancelText                     | 取消按钮文字                                                   | ReactNode        | 取消 |
| okText                         | 确认按钮文字                                                   | ReactNode        | 确定 |

## Demos

@todo

## TODOS

* more themes
* Testing
