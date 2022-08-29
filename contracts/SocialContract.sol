// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// A Social Media platform where people can monetize their content

contract SocialMediaContract is ERC20 {
    // Variables
    using Counters for Counters.Counter; // OpenZepplin Counter
    Counters.Counter private _posts; // Counter For Posts
    address payable owner; // Contract Owner Address

    struct Post {
        uint id;
        string posthash; // This will include image and description
        address payable author; // Author Address
        bool deleted; // Delete Status
        uint likes; // Post Likes
        uint postedAt; // TimeStamp
        uint tipAmount; // Amount of TOKENS tipped to Author
        string commentsHash; // IPFS hash for the comments
    }

    event PostCreated(
        uint id,
        string posthash,
        address payable author,
        bool deleted,
        uint likes,
        uint postedAt,
        uint tipAmount
    );

    // Mappings
    mapping(uint256 => Post) private idToPost;
    mapping(address => mapping(uint => bool)) private liked; // mapping for user if he/she has liked the post or not

    // the specified amount of tokens to be rewarded to a user for making an interaction
    uint postReward;
    uint likeReward;
    uint commentReward;

    constructor(uint initialSupply, uint _postReward, uint _likeReward,  uint _commentReward) ERC20("SOCIAL", "SOC") {
        owner = payable(msg.sender);
        _mint(owner, initialSupply);
        postReward = _postReward;
        likeReward = _likeReward;
        commentReward = _commentReward;
    }

    // Creates a Post
    function createPost(string memory _postHash) public {
        require(bytes(_postHash).length > 0, "PostHash Not Found");

        _posts.increment();
        uint256 newPostId = _posts.current(); // Post Counter Incremented
        uint likes = 0; // Likes initialized to zero
        uint postedAt = block.timestamp; // Post Timestamp
        bool deleted = false; // Post Status default false
        uint tipAmount = 1; // tipAmount initialized to zero
        string memory comments = " ";

        idToPost[newPostId] = Post(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt,
            tipAmount,
            comments
        );

        liked[msg.sender][newPostId] = false;

        uint decimals = decimals();
        uint reward = postReward * (10 ** decimals);

        _mint(msg.sender, reward);

        emit PostCreated(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt,
            tipAmount
        );
    }

    // Return all posts stored in mapping
    function fetchPosts() public view returns (Post[] memory) {
        uint postCount = _posts.current();
        uint currentIndex = 0;
        Post[] memory posts = new Post[](postCount);
        for (uint i = 0; i < postCount; i++) {
            if (idToPost[i + 1].deleted == false) {
                uint currentId = i + 1;
                Post storage currentPost = idToPost[currentId];
                posts[currentIndex] = currentPost;
                currentIndex += 1;
            }
        }
        return posts;
    }

    // Delete Post
    function deletePost(uint _id) public {
        // Post Can only be deleted by author
        address author = idToPost[_id].author;
        require(msg.sender == author, "Post can only be deleted by owner"); // Checks Author
        // Set Delete Status to true
        idToPost[_id].deleted = true;
    }

    // Like Post
    function likePost(uint _id) public {
        bool likeStatus = liked[msg.sender][_id];
        require(likeStatus == false, "User has Liked this Post Before");
        liked[msg.sender][_id] = true;
        uint postLikes = idToPost[_id].likes;
        idToPost[_id].likes = postLikes + 1;

        uint decimals = decimals();
        uint reward = likeReward * (10 ** decimals);

        _mint(msg.sender, reward);
    }

    // function to comment on post
    function commentPost(uint id, string memory newHash) public {
        uint postCount = getPostCount();
        require(id <= postCount, "The post does not exist");

        idToPost[id].commentsHash = newHash;

        uint decimals = decimals();
        uint reward = commentReward * (10 ** decimals);

        _mint(msg.sender, reward);
    }

    // Dislike Post
    function dislikePost(uint _id) public {
        bool likeStatus = liked[msg.sender][_id];
        require(likeStatus == true, "User has DisLiked this Post Before");
        liked[msg.sender][_id] = false;
        uint postLikes = idToPost[_id].likes;
        idToPost[_id].likes = postLikes - 1;
    }

    // To edit the hash of a hash
    function editPost(uint _id, string memory _hash) public {
        // Post Can only be edited by author
        address author = idToPost[_id].author;
        require(msg.sender == author, "Post can only be edited by owner"); // Checks Author
        // Set Post Hash to new Hash
        idToPost[_id].posthash = _hash;
    }

    // function to tip a post
    function tipPost(uint id) public {
        uint postCount = getPostCount();
        require(id <= postCount, "The post does not exist");

        address author = idToPost[id].author;
        uint tip = idToPost[id].tipAmount;
        uint decimals = decimals();
        uint amount = tip * (10 ** decimals);

        transfer(author, amount);
    }

    // Return all posts of msg.sender
    function fetchMyPosts() public view returns (Post[] memory) {
        uint totalPostCount = _posts.current();
        uint currentIndex = 0;
        uint itemCount = 0;

        for (uint i = 0; i < totalPostCount; i++) {
            if (idToPost[i + 1].author == msg.sender) {
                itemCount += 1;
            }
        }

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < totalPostCount; i++) {
            if (idToPost[i + 1].author == msg.sender) {
                uint currentId = i + 1;
                Post storage currentPost = idToPost[currentId];
                posts[currentIndex] = currentPost;
                currentIndex += 1;
            }
        }
        return posts;
    }

    // Setter and Getter Functions
    function getPostCount() public view returns (uint) {
        return _posts.current();
    }

    function getLikeCount(uint _id) public view returns (uint) {
        return idToPost[_id].likes;
    }
    

}
