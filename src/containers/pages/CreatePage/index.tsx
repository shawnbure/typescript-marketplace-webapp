export const CreatePage: (props: any) => any = ({ }) => {

    return (

        <div className="p-create-page">

            <div className="row center-xs u-padding-tb-spacing-9">

                <div className="col-xs-11 col-md-10">


                    <div className="row row--standard-max">

                        <div className="col-xs-12">

                            <div className="u-text-theme-white">
                                <div>
                                    <p>collectionName</p>
                                    <input type="text" />
                                </div>

                                <div>

                                    <p>description</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>discordLink</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>discordLink</p>
                                    <input type="text" />
                                </div>
                                
                                <div>
                                    <p>instagramLink</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>telegramLink</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>tokenId</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>twitterLink</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>userAddress</p>
                                    <input type="text" />
                                </div>

                                <div>
                                    <p>website</p>
                                    <input type="text" />
                                </div>


                                
                                <button className="c-button c-button--primary">Create</button>
                            </div>


                        </div>


                    </div>

                </div>

            </div>

        </div>
    );
};

export default CreatePage;
