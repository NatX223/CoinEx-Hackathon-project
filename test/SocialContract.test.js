const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("Unit Testing of SocialMediaContract", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function LoadFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Contract = await ethers.getContractFactory("SocialMediaContract");
    const socialContract = await Contract.deploy(100000);
    const postHash = "0x000000000000";
    const postId = 1;

<<<<<<< HEAD
    await socialContract.createPost(postHash); //Creating First Post
=======
    await socialContract.createPost(postHash.toString()); //Creating First Post
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb

    return { socialContract, owner, otherAccount, postHash, postId };
  }

  describe("Checking createPost Function", function () {
    it("Check counter is equal to 1", async function () {
      const { socialContract } = await loadFixture(LoadFixture);
      expect(await socialContract.getPostCount()).to.equal(1);
    });
    it("Should revert with error (PostHash Not Found) if no hash", async function () {
      const { socialContract } = await loadFixture(LoadFixture);
      const hash = "";
      await expect(
<<<<<<< HEAD
        socialContract.createPost(hash)
=======
        socialContract.createPost(hash.toString())
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
      ).to.be.revertedWith("PostHash Not Found");
    });
    it("Should emit event PostCreated", async function () {
      const { socialContract, postHash } = await loadFixture(LoadFixture);

<<<<<<< HEAD
      await expect(socialContract.createPost(postHash)).to.emit(
=======
      await expect(socialContract.createPost(postHash.toString())).to.emit(
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
        socialContract,
        "PostCreated"
      );
    });
  });

  describe("Checking likePost Function", function () {
    it("First Post's Like counter should be equal to 0", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
<<<<<<< HEAD
      expect(await socialContract.getLikeCount(postId)).to.equal(0);
    });
    it("First Post's Like counter should be equal to 1 After likePost", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
      await socialContract.likePost(postId);
      expect(await socialContract.getLikeCount(postId)).to.equal(1);
=======
      expect(await socialContract.getLikeCount(postId.toString())).to.equal(0);
    });
    it("First Post's Like counter should be equal to 1 After likePost", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
      await socialContract.likePost(postId.toString());
      expect(await socialContract.getLikeCount(postId.toString())).to.equal(1);
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
    });
    it("Like with other Account(Counter should be 2 now)", async function () {
      const { socialContract, postId, otherAccount } = await loadFixture(
        LoadFixture
      );
<<<<<<< HEAD
      await socialContract.likePost(postId);
      await socialContract.connect(otherAccount).likePost(postId);
      expect(await socialContract.getLikeCount(postId)).to.equal(2);
=======
      await socialContract.likePost(postId.toString());
      await socialContract.connect(otherAccount).likePost(postId.toString());
      expect(await socialContract.getLikeCount(postId.toString())).to.equal(2);
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
    });
    it("Should revert with error (User has Liked this Post Before)", async function () {
      const { socialContract, postId, otherAccount } = await loadFixture(
        LoadFixture
      );
<<<<<<< HEAD
      await socialContract.connect(otherAccount).likePost(postId);
      await expect(
        socialContract.connect(otherAccount).likePost(postId)
=======
      await socialContract.connect(otherAccount).likePost(postId.toString());
      await expect(
        socialContract.connect(otherAccount).likePost(postId.toString())
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
      ).to.be.revertedWith("User has Liked this Post Before");
    });
  });

  describe("Check fetchPosts", function () {
    it("Query Posts", async function () {
      const { socialContract, otherAccount } = await loadFixture(LoadFixture);
      const hash = "0x000000002";
      // Create Post with other account
<<<<<<< HEAD
      await socialContract.connect(otherAccount).createPost(hash);
=======
      await socialContract.connect(otherAccount).createPost(hash.toString());
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
      posts = await socialContract.fetchPosts();
      posts = await Promise.all(
        posts.map(async (i) => {
          let post = {
            id: i.id.toString(),
            hash: i.posthash,
            author: i.author,
            deleted: i.deleted,
            likes: i.likes.toString(),
            postedAt: i.postedAt.toString(),
            tipAmount: i.tipAmount.toString(),
          };
          return post;
        })
      );
      console.log("posts: ", posts);
    });
  });
<<<<<<< HEAD

  describe("check deletePost function", function () {
    it("should delete post without reverting", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
      await expect(socialContract.deletePost(postId)).not.to.be.reverted;
    });
    it("should revert if another user tries deleting the post", async function () {
      const { socialContract, otherAccount, postId } = await loadFixture(LoadFixture);
      await expect(
        socialContract.connect(otherAccount).deletePost(postId)
      ).to.be.revertedWith("Post can only be deleted by owner");
    });
  });

  describe("check editPost function", function () {
    it("should edit post without reverting", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
      const Hash = "0x000000000003";
      await expect(socialContract.editPost(postId, Hash)).not.to.be.reverted;
    });
    it("should revert if another user tries editting the post", async function () {
      const { socialContract, otherAccount, postId } = await loadFixture(LoadFixture);
      const Hash = "0x000000000003";
      await expect(
        socialContract.connect(otherAccount).editPost(postId, Hash)
      ).to.be.revertedWith("Post can only be edited by owner");
    });
  });

  describe("check dislikePost function", function () {
    it("should dislike post", async function () {
      const { socialContract, otherAccount, postId } = await loadFixture(LoadFixture);
      await socialContract.likePost(postId);
      await socialContract.connect(otherAccount).likePost(postId);
      await socialContract.dislikePost(postId);
      expect(await socialContract.getLikeCount(postId)).to.equal(1);
    });
    it("should revert if post has been disliked already", async function () {
      const { socialContract, otherAccount, postId } = await loadFixture(LoadFixture);
      await socialContract.likePost(postId);
      await socialContract.dislikePost(postId);
      await expect(
        socialContract.dislikePost(postId)
      ).to.be.revertedWith("User has DisLiked this Post Before");
    });
  });
=======
>>>>>>> 0b802425a0ac361ae3ed7f075250ad3740dfdcbb
});
