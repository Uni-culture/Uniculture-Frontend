import Header from "./Header/Header";

const Layout = (props) => {
    return (
        <div style={{ backgroundColor: '#FBFBF3',  minHeight: '100vh'}}>
            <Header />
            <div style={{padding: "15px 100px 100px" }}>
                {props.children}
            </div>
        </div>
    );
};

export default Layout;
