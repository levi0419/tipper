// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Tipper{
    struct Staff{
        address payable owner;
        string name;
        string image;
        string bio;
        string age;
        string jobDescription;
        uint totalAmount;
    }
    address internal companyAddress;

    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    mapping(uint256 => Staff) internal staffs;
    uint staffLength = 0;

    mapping(address => bool) admins;

    modifier isAdmin() {        
        require(admins[msg.sender], "Accessible only to the admin");
        _;
    }

    constructor() {    
        companyAddress = msg.sender; // set the company address at deployment
        admins[companyAddress] = true; // add company address to admins
    }

    // only company can add a new admin
    function addNewAdmin(address _newAdminAddress) public isAdmin {
        admins[_newAdminAddress] = true;
    }

    // add a new staff
    function addStaff(
        string memory _name,
        string memory _image,
        string memory _bio,
        string memory _age,
        string memory _jobDescription
    )public isAdmin(){
        staffs[staffLength] = Staff(
            payable(msg.sender),
            _name,
            _image,
            _bio,
            _age,
            _jobDescription,
            0
        );
        staffLength++;
    }

    // get staff at inded `_index`
    function getStaff(uint _index)public view returns(
        address payable,
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        uint
    ){
       Staff storage _staff = staffs[_index];
       return (
           _staff.owner,
           _staff.name,
           _staff.image,
           _staff.bio,
           _staff.age,
           _staff.jobDescription,
           _staff.totalAmount
       );
    }

    // tip staff at index `_index` with amount `_amount`
    function tipStaff(uint _index, uint256 amount) public payable {
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                staffs[_index].owner,
                amount
            ),
            "Could not tip"
        );
        staffs[_index].totalAmount += amount;
    }

    // check is `address` is admin
    function isUserAdmin(address _address) public view returns (bool) {
       return admins[_address];
    }

    // remove admin privilledge from `_adminAddress`
    function removeAdmin(address _adminAddress) public {
        require(msg.sender == companyAddress); // only company can remove admin right from user
        admins[_adminAddress] = false;
    }

    // this function creates a loop hole in contract
    // function changeAdminAddress(address _address)public{
    //     companyAddress = _address;
    // }

    // get total length of staff
    function getStaffLength() public view returns(uint){
        return staffLength;
    }

}