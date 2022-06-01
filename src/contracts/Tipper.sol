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
    address internal companyAddress = msg.sender;
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    mapping(uint256 => Staff) internal staffs;
    uint staffLength = 0;


    modifier isAdmin() {
        require(msg.sender == companyAddress, "Accessible only to the admin");
        _;
    }

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

    function isUserAdmin(address _address) public view returns (bool) {
        if (_address == companyAddress) {
            return true;
        }
        return false;
    }

    function changeAdminAddress(address _address)public{
        companyAddress = _address;
    }

    function getStaffLength() public view returns(uint){
        return staffLength;
    }

}