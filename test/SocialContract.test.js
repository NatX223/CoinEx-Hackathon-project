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

    await socialContract.createPost(postHash.toString()); //Creating First Post

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
        socialContract.createPost(hash.toString())
      ).to.be.revertedWith("PostHash Not Found");
    });
    it("Should emit event PostCreated", async function () {
      const { socialContract, postHash } = await loadFixture(LoadFixture);

      await expect(socialContract.createPost(postHash.toString())).to.emit(
        socialContract,
        "PostCreated"
      );
    });
  });

  describe("Checking likePost Function", function () {
    it("First Post's Like counter should be equal to 0", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
      expect(await socialContract.getLikeCount(postId.toString())).to.equal(0);
    });
    it("First Post's Like counter should be equal to 1 After likePost", async function () {
      const { socialContract, postId } = await loadFixture(LoadFixture);
      await socialContract.likePost(postId.toString());
      expect(await socialContract.getLikeCount(postId.toString())).to.equal(1);
    });
    it("Like with other Account(Counter should be 2 now)", async function () {
      const { socialContract, postId, otherAccount } = await loadFixture(
        LoadFixture
      );
      await socialContract.likePost(postId.toString());
      await socialContract.connect(otherAccount).likePost(postId.toString());
      expect(await socialContract.getLikeCount(postId.toString())).to.equal(2);
    });
    it("Should revert with error (User has Liked this Post Before)", async function () {
      const { socialContract, postId, otherAccount } = await loadFixture(
        LoadFixture
      );
      await socialContract.connect(otherAccount).likePost(postId.toString());
      await expect(
        socialContract.connect(otherAccount).likePost(postId.toString())
      ).to.be.revertedWith("User has Liked this Post Before");
    });
  });

  describe("Check fetchPosts", function () {
    it("Query Posts", async function () {
      const { socialContract, otherAccount } = await loadFixture(LoadFixture);
      const hash = "0x000000002";
      // Create Post with other account
      await socialContract.connect(otherAccount).createPost(hash.toString());
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
});
