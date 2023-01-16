import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 10,
        category: 'general',
    }
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }
    // checked
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0
        }
        document.title = "NewsUpdate- " + this.props.category;


    }
    async updateNews() {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        this.props.setProgress(70);
        // console.log(parsedData);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false
        });
        this.props.setProgress(100);

    }
    async componentDidMount() {
        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=1&pageSize=${this.props.pageSize}`;
        // this.setState({loading:true});
        // let data = await fetch(url);
        // let parsedData = await data.json();
        // // console.log(parsedData);
        // this.setState({ articles: parsedData.articles, 
        //     totalResults: parsedData.totalResults ,
        //     loading: false
        // });
        this.updateNews();
    }
    handleprevclick = async () => {

        // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        // this.setState({loading:true})
        // let data = await fetch(url);
        // let parsedData = await data.json()
        // this.setState({
        //     page: this.state.page - 1,
        //     articles: parsedData.articles,
        //     loading: false

        // }
        // )
        this.setState({ page: this.state.page - 1 })
        this.updateNews();
    }
    handlenextclick = async () => {
        // if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {
        //     let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`; 
        //     this.setState({loading:true});
        //     let data = await fetch(url);
        //     let parsedData = await data.json()
        //     this.setState({
        //         page: this.state.page + 1,
        //         articles: parsedData.articles,
        //         loading: false
        //     }
        //     )
        // }
        this.setState({ page: this.state.page + 1 })
        this.updateNews();
    }
     fetchMoreData =async () => {

        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
        this.setState({page: this.state.page+1})
        // this.setState({ loading: true });
        let data = await fetch(url);
        let parsedData = await data.json();
        // console.log(parsedData);
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults
            // loading: false
        });
      };
    render() {
        return (
            <div>
                <h2 className='text-center'>Top Headlines on {this.props.category} Category</h2>
                {this.state.loading&&<Spinner/>}
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length!==this.state.totalResults}
                    loader={<Spinner/>}
                >
                    <div className="container">
                    <div className="row">
                        {/* !this.state.loading && */}
                        {this.state.articles.map((e) => {
                            return <div className="col-md-4" key={e.url}>
                                <NewsItem title={e.title ? e.title.slice(0, 40) : "No title"} author={e.author} date={e.publishedAt} imgurl={e.urlToImage ? e.urlToImage : "No Image"} newsUrl={e.url ? e.url : ""} description={e.description ? e.description.slice(0, 80) : "No Description"} />
                            </div>

                        })}
</div>
                    </div>
                </InfiniteScroll>

                {/* <div className="container my-3 d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} onClick={this.handleprevclick} className="btn btn-primary"> &larr; prev</button>

                    <button type="button" disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} className="btn btn-primary" onClick={this.handlenextclick}>next &rarr;</button>
                </div> */}
            </div>

        )
    }
}

export default News