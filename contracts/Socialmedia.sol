// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract socialContract {

    //variables
    address public deployer;

    // mapping for an address to the ipfs hash of his profile
    mapping (address => string) profileHash;

    // a struct of a post
    struct post {
        address owner;
        uint count;
        string postHash;
        uint likeCount;
        // uint commentCount; work on comment
        //to be included in post hash
        // string body
        // string imagehash
        // bool mintable;
        // uint amount;
        // address contractAddress;
    }

    // post counter
    uint public postCounter;

    // an array holding all posts to be displayed
    post[] public allPosts;

    // a mapping of an address to its posts
    mapping (address => post[]) userPosts;

    // a mapping of a users liked posts
    mapping (address => post[]) userLikedPost;

    constructor() {
        deployer = msg.sender;
        postCounter = 0;
    }

    // functions

    function makePost(string memory _postHash) public {
        // instantiating a post instance
        post memory p;

        // defining a post instance
        p.owner = msg.sender;
        p.postHash = _postHash; // to be gotten when when a post and its description and image are uploaded to ipfs
        p.count = postCounter++;
        p.likeCount = 0;

        // recording the posts in allPosts
        allPosts.push(p);
    }

    // function to delete a post
    function deletePost(uint count) public {
        // get the post from the all posts and userposts arrays
        post[] storage _posts = userPosts[msg.sender];
        post memory p = allPosts[count];
        post storage _post = _posts[count];
        // require that only the owner of the post can delete it
        require(msg.sender == p.owner);
        // set the post params to null, zero or empty
        p.postHash = "deleted";
        _post.postHash = "deleted";
    }

    function getAllPosts() public view returns(post[] memory) {
        return allPosts;
    }

    function getUserPosts(address user) public view returns(post[] memory p) {
        p = userPosts[user];
        return p;
    }

    function likePost(uint count) public view {
        post memory p = allPosts[count];
        uint likeCount = p.likeCount;
        p.likeCount = likeCount + 1;
    }

    function unLikePost(uint count) public view {
        post memory p = allPosts[count];
        uint likeCount = p.likeCount;
        p.likeCount = likeCount - 1;
    }
}