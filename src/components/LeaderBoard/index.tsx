import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Views from './Views';
import Likes from './Likes';

const Manga = () => {
    return (
        <Tabs defaultValue="view">
            <TabsList className="grid grid-cols-2 gap-2 bg-primary-foreground" >
                <TabsTrigger value="view">Lượt xem</TabsTrigger>
                <TabsTrigger value="like">Lượt thích</TabsTrigger>
            </TabsList>

            <TabsContent value="view">
                <Views />
            </TabsContent>

            <TabsContent value="like">
                <Likes />
            </TabsContent>
        </Tabs>
    );
};

export default Manga;