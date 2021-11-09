import React, { CSSProperties, ReactNode, useEffect, useState } from "react";
import { Button, Input, Menu } from "antd";
import { Link, useHistory } from "react-router-dom";


export interface MenuPathRenderProps {
    type?: ('default' | 'parent' | 'child');
    itemsMap: Object,
    itemKeyArray: Array<string>,
    mode?: ("horizontal" | "vertical"),
    className?: string
    style?: CSSProperties
}

/**
 * 菜单与url路径选中渲染
 */
const MenuPathRender = (menuPathRenderProps: MenuPathRenderProps) => {

    const [selectKey, setSelectKey] = useState<any>();
    const itemsMap = menuPathRenderProps.itemsMap;
    const itemKeyArray = menuPathRenderProps.itemKeyArray;

    const history = useHistory();

    useEffect(() => {
        const pathname = history.location.pathname;
        const type = menuPathRenderProps.type || "child";
        if (type === "parent") {
            const item = itemKeyArray.find(item => pathname.startsWith(item));
            setSelectKey(item)
        } else {
            setSelectKey(history.location.pathname);
        }
    }, [history.location.pathname]);

    return (
        <Menu mode={menuPathRenderProps.mode || "vertical"} className={menuPathRenderProps.className} style={menuPathRenderProps.style} selectedKeys={[selectKey]}>
            {
                itemKeyArray.map(item => (
                    <Menu.Item key={item} icon={itemsMap[item]?.icon} >
                        <Link to={itemsMap[item].to}>
                            {itemsMap[item].name}
                        </Link>
                    </Menu.Item>
                ))
            }
        </Menu>
    )
};

export default MenuPathRender;
