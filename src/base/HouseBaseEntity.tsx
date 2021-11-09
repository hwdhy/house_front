// 房屋标签集合
export const HouseTagList = ["原房东", "红本厂房", "豪华装修", "绿化率高", "标准厂房", "花园厂房", "高速路口", "工业园", "可办环评"];

// 房屋结构集合
export const HouseDirectionList = [{ value: 1, label: "标准厂房" }, { value: 2, label: "钢结构" }, { value: 3, label: "其他" }];

// 房屋楼层集合
export const HouseFloorList = [{ value: 1, label: "一楼" }, { value: 2, label: "二楼以上" }, { value: 3, label: "独栋" }, { value: 4, label: "独门独院" }];

// 房屋状态映射
export const HouseStatusMap = {
    0: "未审核",
    1: "可出租",
    2: "已出租",
    3: "已下架",
};
