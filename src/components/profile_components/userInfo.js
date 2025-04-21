import useUserData from "@/store/userData";
export default function UserInfo() {
    const userData = useUserData();

    return (
        <>
            <p>You've been active for "30" days in a row!</p>
        </>
    )
}