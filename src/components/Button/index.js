import getClassName from "getclassname"
import "./style.scss"

const ButtonLoader = () => {
    return <div className="button__loader">
      <div className="button__loader__dot"/>
      <div className="button__loader__dot"/>
      <div className="button__loader__dot"/>
    </div>
}

const Button = ({ loading, children, onClick }) => {

    const handleClick = e => {
        e.preventDefault()
        !loading && onClick?.(e)
    }

    const buttonClass = getClassName({
        base: "button",
        "&--loading": loading
    })

    const buttonLabelClass = buttonClass.extend("&__label").recompute({
        "&--loading": loading
    })

    return <button
        className={buttonClass}
        onClick={handleClick}
    >
        <div className={buttonLabelClass}>{children}</div>
        {loading && <ButtonLoader />}
    </button>
}

export default Button